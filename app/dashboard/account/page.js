"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { toast } from "react-toastify";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState({
    email: "",
    storeName: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccountData = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          setIsLoading(true);
          const response = await axios.get(`/api/dashboard`);
          setUser({
            email: response.data.user.email,
            storeName: response.data.store.name,
          });
        } catch (error) {
          console.error("Error fetching account data:", error);
          toast.error("Failed to load account data. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAccountData();
  }, [session, status]);

  if (status === "loading" || isLoading) return <div>Loading...</div>;
  if (!session) return <div>Please sign in to view your account.</div>;

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Store Name:</strong> {user.storeName}
            </p>
            <Button variant="outline" className="mt-4">
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="mb-2">
              View Billing History
            </Button>
            <Button variant="outline">Update Payment Method</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
