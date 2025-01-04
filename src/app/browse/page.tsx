import { redirect } from "next/navigation";
import { RedirectType } from "next/dist/client/components/redirect";

import Navbar from "@/components/Navbar";
import ReturnButton from "@/components/ReturnButton";
import store from "@/redux/store";

import BrowseMain from "./main";

const Browse = async () => {
	if (!store.getState().user.isAuthed) {
		console.info("[Nav] Redirecting from Browse back to Home");
		redirect("/", RedirectType.replace);
	}

	return (
		<main>
			<Navbar />
			<BrowseMain />
			<ReturnButton />
		</main>
	);
};

export default Browse;
