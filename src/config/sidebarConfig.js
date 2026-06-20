// import { ROLES } from "@/constants/roles";
// import {
//   LayoutDashboard,
//   Users,
//   ShieldCheck,
//   Headphones,
//   Store,
//   Package,
//   ShoppingCart,
//   FolderTree,
//   Tags,
//   Star,
//   Wallet,
//   Ticket,
//   Activity,
//   Settings,
// } from "lucide-react";

// export const sidebarConfig = {
//   [ROLES.SUPER_ADMIN]: [
//     {
//       group: "Main",
//       icon: LayoutDashboard,
//       items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
//     },
//     {
//       group: "User Management",
//       icon: Users,
//       items: [
//         { title: "Users", href: "/dashboard/users", icon: Users },
//         { title: "Admins", href: "/dashboard/admins", icon: ShieldCheck },
//         { title: "Support Agents", href: "/dashboard/support-agents", icon: Headphones },
//       ],
//     },
//     {
//       group: "Marketplace",
//       icon: Store,
//       items: [
//         { title: "Vendors", href: "/dashboard/vendors", icon: Store },
//         { title: "Products", href: "/dashboard/products", icon: Package },
//         { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
//         { title: "Categories", href: "/dashboard/categories", icon: FolderTree },
//         { title: "Brands", href: "/dashboard/brands", icon: Tags },
//         { title: "Reviews", href: "/dashboard/reviews", icon: Star },
//       ],
//     },
//     {
//       group: "Finance",
//       icon: Wallet,
//       items: [{ title: "Payout Approvals", href: "/dashboard/payout-approvals", icon: Wallet }],
//     },
//     {
//       group: "Support",
//       icon: Ticket,
//       items: [{ title: "Support Tickets", href: "/dashboard/tickets", icon: Ticket }],
//     },
//     {
//       group: "System",
//       icon: Settings,
//       items: [
//         { title: "Activity Logs", href: "/dashboard/activity-logs", icon: Activity },
//         { title: "System Settings", href: "/dashboard/settings", icon: Settings },
//       ],
//     },
//   ],
// };
import { ROLES } from "@/constants/roles";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Headphones,
  Store,
  Package,
  ShoppingCart,
  FolderTree,
  Tags,
  Star,
  Wallet,
  Ticket,
  Activity,
  Settings,
  Heart,
  User,
} from "lucide-react";

export const sidebarConfig = {
  [ROLES.CUSTOMER]: [
    {
      group: "Main",
      icon: LayoutDashboard,
      items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
    },
    {
      group: "Shopping",
      icon: ShoppingCart,
      items: [
        { title: "My Orders", href: "/dashboard/orders", icon: ShoppingCart },
        { title: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
        { title: "Reviews", href: "/dashboard/reviews", icon: Star },
      ],
    },
    {
      group: "Support",
      icon: Ticket,
      items: [{ title: "Support Tickets", href: "/dashboard/tickets", icon: Ticket }],
    },
    {
      group: "Account",
      icon: User,
      items: [{ title: "Profile", href: "/dashboard/profile", icon: User }],
    },
  ],

  [ROLES.VENDOR]: [
    {
      group: "Main",
      icon: LayoutDashboard,
      items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
    },
    {
      group: "Business",
      icon: Store,
      items: [
        { title: "Products", href: "/dashboard/products", icon: Package },
        { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
        { title: "Payouts", href: "/dashboard/payouts", icon: Wallet },
        { title: "Reviews", href: "/dashboard/reviews", icon: Star },
      ],
    },
    {
      group: "Support",
      icon: Ticket,
      items: [{ title: "Support Tickets", href: "/dashboard/tickets", icon: Ticket }],
    },
    {
      group: "Account",
      icon: User,
      items: [{ title: "Profile", href: "/dashboard/profile", icon: User }],
    },
  ],

  [ROLES.ADMIN]: [
    {
      group: "Main",
      icon: LayoutDashboard,
      items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
    },
    {
      group: "Marketplace",
      icon: Store,
      items: [
        { title: "Vendors", href: "/dashboard/vendors", icon: Store },
        { title: "Products", href: "/dashboard/products", icon: Package },
        { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
        { title: "Categories", href: "/dashboard/categories", icon: FolderTree },
        { title: "Brands", href: "/dashboard/brands", icon: Tags },
        { title: "Reviews", href: "/dashboard/reviews", icon: Star },
      ],
    },
    {
      group: "Support",
      icon: Ticket,
      items: [{ title: "Support Tickets", href: "/dashboard/tickets", icon: Ticket }],
    },
  ],

  [ROLES.SUPER_ADMIN]: [
    {
      group: "Main",
      icon: LayoutDashboard,
      items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
    },
    {
      group: "User Management",
      icon: Users,
      items: [
        { title: "Users", href: "/dashboard/users", icon: Users },
        { title: "Admins", href: "/dashboard/admins", icon: ShieldCheck },
        { title: "Support Agents", href: "/dashboard/support-agents", icon: Headphones },
      ],
    },
    {
      group: "Marketplace",
      icon: Store,
      items: [
        { title: "Vendors", href: "/dashboard/vendors", icon: Store },
        { title: "Products", href: "/dashboard/products", icon: Package },
        { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
        { title: "Categories", href: "/dashboard/categories", icon: FolderTree },
        { title: "Brands", href: "/dashboard/brands", icon: Tags },
        { title: "Reviews", href: "/dashboard/reviews", icon: Star },
      ],
    },
    {
      group: "Finance",
      icon: Wallet,
      items: [{ title: "Payout Approvals", href: "/dashboard/payout-approvals", icon: Wallet }],
    },
    {
      group: "Support",
      icon: Ticket,
      items: [{ title: "Support Tickets", href: "/dashboard/tickets", icon: Ticket }],
    },
    {
      group: "System",
      icon: Settings,
      items: [
        { title: "Activity Logs", href: "/dashboard/activity-logs", icon: Activity },
        { title: "System Settings", href: "/dashboard/settings", icon: Settings },
      ],
    },
  ],

  [ROLES.SUPPORT_AGENT]: [
    {
      group: "Main",
      icon: LayoutDashboard,
      items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
    },
    {
      group: "Support",
      icon: Ticket,
      items: [{ title: "Support Tickets", href: "/dashboard/tickets", icon: Ticket }],
    },
    {
      group: "Customer Help",
      icon: Users,
      items: [
        { title: "Customers", href: "/dashboard/customers", icon: Users },
        { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
      ],
    },
  ],
};