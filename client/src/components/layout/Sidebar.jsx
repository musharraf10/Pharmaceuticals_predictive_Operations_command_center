import {
    LayoutDashboard,
    Package,
    Boxes,
    Truck,
    Factory,
    ShoppingCart,
    BrainCircuit,
    CheckCircle2,
    ClipboardList,
    AlertTriangle,
    Bell,
    FileText,
    Users,
} from "lucide-react";

import { MENU_ITEMS as menu } from "../../constants/sidebar";

const Sidebar = () => {
    return (
        <aside className="w-72 bg-secondary-900 text-white">
            <div className="border-b border-secondary-700 p-6">
                <h1 className="text-xl font-bold">
                    PharmaOps AI
                </h1>

                <p className="mt-1 text-sm text-secondary-300">
                    Operations Command Center
                </p>
            </div>

            <nav className="space-y-2 p-4">
                {menu.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.title}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-secondary-800"
                        >
                            <Icon size={20} />

                            {item.title}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;