export const metadata = {
  title: 'About',
  description: 'About Brandon',
};

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div>
            {children}
        </div>
    );
}