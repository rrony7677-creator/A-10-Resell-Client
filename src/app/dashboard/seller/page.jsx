"use client"
import { DashboardStats } from '@/app/component/dashboard/DashboardStats';
import { useSession } from '@/lib/auth-client';
import { CircleCheck, Layers, Persons, Thunderbolt } from '@gravity-ui/icons';
import { redirect } from 'next/navigation';
import React from 'react';

const SellerPage = () => {
    const {data: session,isPending} = useSession();
    if(isPending) return <div>Loading...</div>;
    if (!session) {redirect("/login"); return null;}

    const recruiterStats = [
        { title: "Total Products", value: "48", icon: Thunderbolt },
        { title: "Total Sales", value: "1,284", icon: Persons },
        { title: "Total Revenue", value: "18", icon: Thunderbolt },
        { title: "Pending Orders", value: "25", icon: CircleCheck },
    ];

    const user = session?.user;
    return (
        <div>
            <h2 className="text-2xl font-semibold text-white mb-4">  Welcome, {user?.name || "Seller"}!</h2>
            <DashboardStats statsData={recruiterStats} />
        </div>
    );
};

export default SellerPage;