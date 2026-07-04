

import type { Metadata } from "next";



export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
       
        <>
        <h1>hhjh</h1>
        
        {/* <SideBar /> */}
        {children}
        </>
        
    );
}