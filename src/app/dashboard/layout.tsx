
import { cookies } from "next/headers";
import Main from "./Main";

export default function DashboardDetails({
    children,
}: {
    children: React.ReactNode;
}) {
    const userCookie = cookies().get('user');
    const user = userCookie ? JSON.parse(userCookie.value).user: null;

    return (
        <Main user={user}>
            {children}
        </Main>
    );
}
