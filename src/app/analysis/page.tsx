import { redirect } from "next/navigation";
import { RedirectType } from "next/dist/client/components/redirect";

import Navbar from "@/components/Navbar";
import ReturnButton from "@/components/ReturnButton";
import store from "@/redux/store";

import AnalysisMain from "./main";

const Analysis = async () => {
	if (!store.getState().user.isAuthed) {
		console.info("[Nav] Redirecting from Analysis back to Home");
		redirect("/", RedirectType.replace);
	}

	return (
		<main>
			<Navbar />
			<AnalysisMain />
			<ReturnButton />
		</main>
	);
};

export default Analysis;
