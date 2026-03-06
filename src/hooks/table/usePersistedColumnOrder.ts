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

    const resolved = savedPreferences.map(pref => columnMap.get(pref.field));
    const existingColumns = resolved.filter((c): c is GridColDef => c !== undefined);
    return existingColumns;
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
    setSavedPreferences(newPreferences)

    try {
      await RequisitionColumnsService.put(tableKey, user, newPreferences)
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