import { useEffect, useMemo, useState } from "react"
import { GridColDef } from "@mui/x-data-grid"
import RequisitionColumnsService from "../../services/requisicoes/RequisitionColumnsService"
import { ReducedUser } from "../../models/User"

export const usePersistedColumnOrder = (
  tableKey: string,
  user: ReducedUser,
  defaultColumns: GridColDef[]
) => {
  const [savedOrder, setSavedOrder] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(true)

  //load
  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const response = await RequisitionColumnsService.get(tableKey, user)
        if (isMounted && response?.ordem?.length > 0) {
          setSavedOrder(response.ordem)
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

//apply
  const orderedColumns = useMemo(() => {
    if (!savedOrder || savedOrder.length === 0) return defaultColumns

    const columnMap = new Map(
      defaultColumns.map(col => [col.field, col])
    )

    return savedOrder
    .map(field => columnMap.get(field))
    .filter((col): col is GridColDef => Boolean(col))
  }, [defaultColumns, savedOrder])

  async function saveColumnOrder(newOrder: string[]) {
    setSavedOrder(newOrder)

    try {
      await RequisitionColumnsService.put(tableKey, user, newOrder)
    } catch (error) {
      console.error("Error saving column preferences", error)
    }
  }

  return {
    orderedColumns,
    saveColumnOrder,
    loading
  }

}