'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FileClock } from 'lucide-react'
import { LogTable } from '@/components/logs/log-table'
import { LogWithDetails } from '@/types/logs'
import { Skeleton } from '@/components/ui/skeleton'
import { SortOptions } from '@/components/logs/sort-options'
import {  filterAndSortLogs } from '@/lib/utils/sorting'

export default function LogsPage() {
  const [logs, setLogs] = useState<LogWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"date" | "status">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [showAllLogs, setShowAllLogs] = useState(false)

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.error('No user found')
        return
      }

      const { data, error } = await supabase
        .from('logs')
        .select(`
          *,
          templates:template_id (name),
          services:service_id (host_address, email_id)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      const logsWithDetails: LogWithDetails[] = data.map(log => ({
        ...log,
        template_name: log.templates?.name || 'Unknown Template',
        host_address: log.services?.host_address || 'Unknown Host',
        email_id: log.services?.email_id || 'Unknown Email'
      }))

      setLogs(logsWithDetails)
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (by: "date" | "status") => {
    if (sortBy === by) {
      // If clicking the same sort option, toggle the order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      // If clicking a different sort option, set it with descending order
      setSortBy(by)
      setSortOrder("desc")
    }
  }

  const handleDateSelect = (date?: Date) => {
    setSelectedDate(date);
  }

  const handleShowAllChange = (show: boolean) => {
    setShowAllLogs(show);
    setSelectedDate(undefined);
  }

  const sortedAndFilteredLogs = filterAndSortLogs(logs, sortBy, sortOrder, selectedDate, showAllLogs)

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center mb-4 sm:mb-6">
          <FileClock className="mr-2 text-[#FF6C37]" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#FF6C37]">Email Logs</h2>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4">
      <div className="flex items-center mb-4 sm:mb-6">
        <FileClock className="mr-2 text-[#FF6C37]" />
        <h2 className="text-xl sm:text-2xl font-bold text-[#FF6C37]">Email Logs</h2>
      </div>
      
      {logs.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-muted/50 rounded-lg border-2 border-dashed">
          <p className="text-sm sm:text-base text-muted-foreground">No logs found</p>
        </div>
      ) : (
        <>
          <SortOptions
            sortBy={sortBy}
            sortOrder={sortOrder}
            selectedDate={selectedDate}
            showAllLogs={showAllLogs}
            onSortChange={handleSortChange}
            onDateSelect={handleDateSelect}
            onShowAllChange={handleShowAllChange}
          />
          <LogTable logs={sortedAndFilteredLogs} />
        </>
      )}
    </div>
  )
}