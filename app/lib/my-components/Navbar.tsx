import { NavLink } from "react-router";
import { CircleX } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { useMemo, useState } from "react";

export const useNavbar = () => {
    const [show, setShowNavbar] = useState(false);
    const NavbarComponent = useMemo(() => {
        return function Navbar({
            links
        }: {
            links?: {
                displayText: string,
                url: string
            }[]
        }) {
            if (!show) return null;
            return (
                <div className={`fixed inset-0 w-full bg-gray-100/60 transition-all ease-out duration-200 backdrop-blur-xs z-50`}>
                    <nav className="absolute inset-x-12 inset-y-14 grid grid-cols-1 grid-rows-10 gap-2">
                        <button className="justify-self-end row-span-1 hover:cursor-pointer" onClick={() => {
                            console.log("closing!");
                            setShowNavbar(false);
                        }}>
                            <CircleX size={32} className="text-gray-500" />
                        </button>
                        <ul className={
                            `row-span-7 flex flex-col justify-start items-center gap-4
                            *:text-lg *:text-center`
                        }>
                            {links?.map((link, i) => {
                                return (
                                    <li key={i} className="">
                                        <NavLink viewTransition
                                            to={link.url}
                                            className={({ isActive, isPending }) => {
                                                return (
                                                    isActive ?
                                                        "bg-gray-500 text-gray-50 font-bold text-center p-2 rounded-md before:content-['->_'] before:text-sm before:align-middle" : ""
                                                );
                                            }}
                                        >
                                            {link.displayText}
                                        </NavLink>
                                    </li>
                                )
                            })}
                        </ul>
                        <LogoutButton className={`justify-self-center self-center row-span-2`} />
                    </nav>
                </div>
            );
        }
    }, [show]);

    return {
        Navbar: NavbarComponent,
        setShowNavbar
    };
};
