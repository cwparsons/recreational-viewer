import Header from '@/app/_components/Header';

export default function Loading() {
  return (
    <>
      <Header
        title={'Loading...'}
        breadcrumbs={[{ label: 'Directory', href: '/' }]}
      />
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
      </div>
    </>
  );
}
