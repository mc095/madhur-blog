
export const metadata = {
    robots: 'noindex, nofollow'
  }
  
  export default function AdminLayout({ children }) {
    return (
      <div className="admin-layout">
        {children}
      </div>
    );
  }