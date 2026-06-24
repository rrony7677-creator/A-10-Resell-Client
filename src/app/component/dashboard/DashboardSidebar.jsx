// import { getUserSession } from "@/lib/core/session";
import { getUserSession } from "@/lib/core/session";
import { Bars, Bell, Bookmark, Layers, CreditCard, Envelope, FileText, Gear, House, Magnifier, Person } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { Factory, Users, ShoppingBag, PlusCircle } from "lucide-react"; // Added marketplace icons
import Link from "next/link";

export async function DashboardSidebar() {

  const user = await getUserSession();

  // 1. Updated Nav Links to reflect a Resell Marketplace (Seller)
  const sellerNavLinks = [
    { icon: House,       href: "/dashboard/seller", label: "Dashboard" },
    { icon: PlusCircle,  href: "/dashboard/seller/add-product", label: "Add Product" },
    { icon: ShoppingBag, href: "/dashboard/seller/my-product", label: "My Product" },
    { icon: Envelope,    href: "/dashboard/seller/manage-orders", label: "Manage Orders" },
    { icon: Person,      href: "/dashboard/seller/sales-analytics", label: "Sales Analytics" },
    // { icon: Gear,        href: "/settings", label: "Settings" },
  ];

  // 2. Updated Nav Links to reflect a Resell Marketplace (Buyer)
  const buyerNavLinks = [
    { icon: House,       href: "/dashboard/buyer", label: "Dashboard" },
    { icon: FileText,    href: "/dashboard/buyer/orders", label: "My Orders" },
    { icon: Bookmark,    href: "/dashboard/buyer/wishlist", label: "Wishlist" },
    { icon: CreditCard,  href: "/dashboard/buyer/payment-history", label: "Payments History"},
    { icon: Person,      href: "/dashboard/buyer/profile", label: "Profile Management" },
    // { icon: Gear,        href: "/settings", label: "Settings" },
  ];

  // 3. Admin Nav Links
  const adminNavLinks = [
    { icon: House,       href: "/dashboard/admin", label: "Dashboard" },
    { icon: Users,       href: "/dashboard/admin/users", label: "Manage Users" },
    { icon: Layers,      href: "/dashboard/admin/categories", label: "Categories" },
    { icon: ShoppingBag, href: "/dashboard/admin/products", label: "All Products" },
    { icon: CreditCard,  href: "/dashboard/admin/payments", label: "Transactions" },
    { icon: Gear,        href: "/dashboard/admin/settings", label: "Settings" },
  ];

  // Map keys directly matching your marketplace user roles
  const navLinksMap = {
    buyer: buyerNavLinks,
    seller: sellerNavLinks,
    admin: adminNavLinks
  };

  // FIX: Fallback to buyerNavLinks if role doesn't match, and safeguard with "|| []" to prevent crashes
  const navItems = navLinksMap[user?.role] || navLinksMap['buyer'] || [];
  
  // console.log("Current system user:", user);

  const navContent = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <Link
          key={item.label}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
          href={item.href}
        >
          <item.icon className="size-5 text-muted" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block">
        {navContent}
      </aside>

      <Drawer>
        <Button className={'lg:hidden'} variant="secondary">
          <Bars />
          Menu
        </Button>
        <Drawer.Backdrop>
          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Header>
                <Drawer.Heading>Navigation</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>
                {navContent}
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}