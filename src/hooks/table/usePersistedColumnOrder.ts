import { useEffect, useMemo, useState } from "react"
import { GridColDef } from "@mui/x-data-grid"
import RequisitionColumnsService from "../../services/requisicoes/RequisitionColumnsService"
import { ReducedUser } from "../../models/User"

export interface ColumnPreference {
  field: string
  hidden: boolean
}

export const usePersistedColumnOrder = (
  tableKey: string,
  user: ReducedUser,
  defaultColumns: GridColDef[]
) => {
  const [savedPreferences, setSavedPreferences] = useState<ColumnPreference[] | null>(null)
  const [loading, setLoading] = useState(true)

  //load
  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const response = await RequisitionColumnsService.get(tableKey, user)
        if (isMounted && response?.ordem?.length > 0) {
          setSavedPreferences(response.ordem as ColumnPreference[])
        }
      } catch (error) {
        console.error("Error fetching column order:", error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }

  }, [tableKey])

  //apply order
  const orderedColumns = useMemo(() => {
    if (!savedPreferences || savedPreferences.length === 0) return defaultColumns

    const columnMap = new Map(
      defaultColumns.map(col => [col.field, col])
    )

    const resolved = savedPreferences.map(pref => columnMap.get(pref.field))
    const existingColumns = resolved.filter((c): c is GridColDef => c !== undefined)

    // Keep columns that are not in saved preferences (e.g. action columns excluded from dialog).
    const existingFields = new Set(existingColumns.map(col => col.field))
    const missingColumns = defaultColumns.filter(col => !existingFields.has(col.field))

    return [...existingColumns, ...missingColumns]
  }, [defaultColumns, savedPreferences])

  const columnVisibilityModel = useMemo(() => {
    if (!savedPreferences) return {}
    const model: Record<string, boolean> = {}
    savedPreferences.forEach(pref => {
      if (pref.hidden) model[pref.field] = false
    })
    return model
  }, [savedPreferences])

  async function saveColumnOrder(newPreferences: ColumnPreference[]) {
    const persistedMap = new Map(newPreferences.map(pref => [pref.field, pref]))

    // Preserve existing saved columns that were not part of the dialog payload.
    if (savedPreferences) {
      savedPreferences.forEach(pref => {
        if (!persistedMap.has(pref.field)) {
          persistedMap.set(pref.field, pref)
        }
      })
    }

    // Guarantee all current table columns exist in persisted preferences.
    defaultColumns.forEach(col => {
      if (!persistedMap.has(col.field)) {
        persistedMap.set(col.field, { field: col.field, hidden: false })
      }
    })

    const mergedPreferences = Array.from(persistedMap.values())

    setSavedPreferences(mergedPreferences)

    try {
      await RequisitionColumnsService.put(tableKey, user, mergedPreferences)
    } catch (error) {
      console.error("Error saving column preferences", error)
    }
  }

  async function removeColumnOrder() {
    try {
      await RequisitionColumnsService.delete(tableKey, user)
      setSavedPreferences(null)
    } catch (error) {
      console.log('Erro ao reordenar a coluna')
    }
  }

  return {
    orderedColumns,
    columnVisibilityModel,
    saveColumnOrder,
    removeColumnOrder,
    loading
  }

}