type Props = {
  title: string;
  children: React.ReactNode;
};

export default function DashboardLayout({ title, children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-8 py-4">
        <h1 className="text-xl font-semibold">{title}</h1>
      </header>

      <main className="p-8">{children}</main>
    </div>
  );
}
