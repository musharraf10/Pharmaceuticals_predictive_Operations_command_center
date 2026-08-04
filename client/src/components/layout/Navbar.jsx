import { Bell, Search, UserCircle2 } from "lucide-react";

const Navbar = () => {
    return (
        <header className="flex h-[72px] items-center justify-between border-b border-secondary-200 bg-white px-6">
            <div>
                <h2 className="text-2xl font-semibold">
                    Dashboard
                </h2>

                <p className="text-sm text-secondary-500">
                    Welcome back 👋
                </p>
            </div>

            <div className="flex items-center gap-4">

                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-3 text-secondary-400"
                    />

                    <input
                        placeholder="Search..."
                        className="rounded-xl border border-secondary-300 py-2 pl-10 pr-4"
                    />
                </div>

                <Bell className="cursor-pointer" />

                <UserCircle2 size={34} />
            </div>
        </header>
    );
};

export default Navbar;