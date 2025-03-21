"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid, Mail, FileText, Zap, Send, ToggleLeft, ToggleRight, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const [servicesCount, setServicesCount] = useState(0);
  const [templatesCount, setTemplatesCount] = useState(0);
  const [rateLimit, setRateLimit] = useState(0);
  const [emailsSentToday, setEmailsSentToday] = useState(0);
  const [totalEmails, setTotalEmails] = useState(0);
  const [emailPeriod, setEmailPeriod] = useState("today");
  const [failedEmailsToday, setFailedEmailsToday] = useState(0);
  const [totalFailedEmails, setTotalFailedEmails] = useState(0);
  const [failedEmailPeriod, setFailedEmailPeriod] = useState("today");

  useEffect(() => {
    fetchCounts();
  }, []);

  async function fetchCounts() {
    const { count: servicesCount } = await supabase
      .from("services")
      .select("*", { count: "exact", head: true });

    const { count: templatesCount } = await supabase
      .from("templates")
      .select("*", { count: "exact", head: true });

    const { data: profileData } = await supabase
      .from("profile")
      .select("rate_limit")
      .single();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Update to fetch successful emails from logs table
    const { count: todayEmailsCount } = await supabase
      .from("logs")
      .select("*", { count: "exact", head: true })
      .eq("status", "success")
      .gte("created_at", today.toISOString());

    const { count: allEmailsCount } = await supabase
      .from("logs")
      .select("*", { count: "exact", head: true })
      .eq("status", "success");

    const { count: todayFailedCount } = await supabase
      .from("logs")
      .select("*", { count: "exact", head: true })
      .eq("status", "failed")
      .gte("created_at", today.toISOString());

    const { count: totalFailedCount } = await supabase
      .from("logs")
      .select("*", { count: "exact", head: true })
      .eq("status", "failed");

    setServicesCount(servicesCount || 0);
    setTemplatesCount(templatesCount || 0);
    setRateLimit(profileData?.rate_limit || 0);
    setEmailsSentToday(todayEmailsCount || 0);
    setTotalEmails(allEmailsCount || 0);
    setFailedEmailsToday(todayFailedCount || 0);
    setTotalFailedEmails(totalFailedCount || 0);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center text-[#FF6C37]">
          <LayoutGrid className="mr-2 w-5 h-5 sm:w-6 sm:h-6" /> Dashboard Overview
        </h2>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-[#FF6C37]/50">
          <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2">
            <div className="flex items-center gap-2">
              <Mail className="text-[#FF6C37] w-5 h-5 sm:w-6 sm:h-6" />
              <CardTitle className="text-base sm:text-lg">Email Services</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-1 sm:pt-2">
            <p className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
              {servicesCount}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Active services
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-[#FF6C37]/50">
          <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2">
            <div className="flex items-center gap-2">
              <FileText className="text-[#FF6C37] w-5 h-5 sm:w-6 sm:h-6" />
              <CardTitle className="text-base sm:text-lg">Email Templates</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-1 sm:pt-2">
            <p className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
              {templatesCount}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Available templates
            </p>
          </CardContent>
        </Card>

        <Card 
          className="border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-[#FF6C37]/50 cursor-pointer"
          onClick={() => setEmailPeriod(emailPeriod === "today" ? "total" : "today")}
        >
          <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="text-[#FF6C37] w-5 h-5 sm:w-6 sm:h-6" />
                <CardTitle className="text-base sm:text-lg">Email Stats</CardTitle>
              </div>
              {emailPeriod === "today" ? 
                <ToggleLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" /> : 
                <ToggleRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              }
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-1 sm:pt-2">
            <p className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
              {emailPeriod === "total" ? totalEmails : emailsSentToday}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {emailPeriod === "total" ? "All time sent" : "Sent in last 24h"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-[#FF6C37]/50">
          <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2">
            <div className="flex items-center gap-2">
              <Zap className="text-[#FF6C37] w-5 h-5 sm:w-6 sm:h-6" />
              <CardTitle className="text-base sm:text-lg">Daily Rate Limit</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-1 sm:pt-2">
            <p className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
              {rateLimit}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Emails remaining
            </p>
          </CardContent>
        </Card>

        <Card 
          className="border-2 border-gray-200 hover:border-red-500/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-red-500/50 cursor-pointer"
          onClick={() => setFailedEmailPeriod(failedEmailPeriod === "today" ? "total" : "today")}
        >
          <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
                <CardTitle className="text-base sm:text-lg">Failed</CardTitle>
              </div>
              {failedEmailPeriod === "today" ? 
                <ToggleLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" /> : 
                <ToggleRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              }
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-1 sm:pt-2">
            <p className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
              {failedEmailPeriod === "total" ? totalFailedEmails : failedEmailsToday}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {failedEmailPeriod === "total" ? "All time failed" : "Failed in last 24h"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}