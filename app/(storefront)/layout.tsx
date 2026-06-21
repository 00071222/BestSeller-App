// app/(storefront)/layout.tsx
export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* TODO: Navbar */}
            <main>{children}</main>
            {/* TODO: Footer */}
        </>
    );
}