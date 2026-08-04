import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AppLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-secondary-100">
            <Sidebar />

            <div className="flex flex-1 flex-col">
                <Navbar />

                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;