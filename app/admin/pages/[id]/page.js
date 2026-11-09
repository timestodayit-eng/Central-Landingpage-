import PageEditor from '@/components/PageEditor';
export const dynamic='force-dynamic';
export default async function EditPage({params}){const {id}=await params;return <PageEditor pageId={id}/>;}
