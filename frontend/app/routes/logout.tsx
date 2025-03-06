import type { Route } from "./+types/logout";

import { Form, Link, redirect } from "react-router";
import Button from "~/components/ui/Button";
import { tokenCookie } from "~/cookies.server";

export async function action({}: Route.ActionArgs) {
  return redirect("/auth", {
    headers: {
      "Set-Cookie": await tokenCookie.serialize(""),
    }
  }); 
}


export default function Logout() {
  return (
    <>
      <div>Are you sure you want to log out?</div>
      <Form method="post">
        <Button>Ye</Button>
      </Form>
      <Link to="/">Never mind</Link>
    </>
  );
}
