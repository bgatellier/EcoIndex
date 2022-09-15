import AnalysisService from "./services/AnalysisService";
import Collapse from "./components/Collapse";
import EcoIndexDialog from "./components/EcoIndexDialog";
import ResultCacheService from "./services/ResultCacheService";
import SiteAnalysisResult from "./components/SiteAnalysisResult";

// ------------------------------------------------------------------------- INIT APP

function initApp() {
	initMenu();
	initCollapses();
	initDialog();
	initPageResult();
	initSubmitUrlForm();
	initButtonRemakeAnalysis();
}

// init app on dom loaded
window.addEventListener("DOMContentLoaded", initApp);

// ------------------------------------------------------------------------- MENU

function initMenu() {
	// Menu toggle button
	const menuBtn = document.querySelector(".menu-btn");
	const mainNavContainer = document.querySelector(".main-nav-container");

	menuBtn &&
		menuBtn.addEventListener("click", function () {
			let expanded = menuBtn.getAttribute("aria-expanded") === "true";
			menuBtn.setAttribute("aria-expanded", !expanded);
			mainNavContainer.dataset["open"] = !expanded;
		});
}

// ------------------------------------------------------------------------- COLLAPSES

/*
 * Init all interactive collapses on page
 */
function initCollapses() {
	const collapseElements = document.querySelectorAll(".js-collapse");
	collapseElements.forEach((collapseElement) => new Collapse(collapseElement));
}

// ------------------------------------------------------------------------- DIALOG TODO

/**
 * Init unique modal dialog
 */
function initDialog() {
	EcoIndexDialog.init("dialog");
}

// ------------------------------------------------------------------------- RESULT PAGE

/**
 * Init page result interactive data from api or url params
 */
function initPageResult() {
	const resultPageContentEl = document.querySelector(".js-result-container");
	if (!resultPageContentEl) return;
	new SiteAnalysisResult(resultPageContentEl);
}

/**
 * Remake analysis button
 * Takes last analysis done and run an update to analysis
 */
async function initButtonRemakeAnalysis() {
	const buttonRemakeEl = document.querySelector(".js-button-retest");
	if (!buttonRemakeEl) return;
	buttonRemakeEl.addEventListener("click", async (e) => {
		e.preventDefault();

		const url = ResultCacheService.getLast().url;
		await AnalysisService.launchAnalysisByURL(url);
	});
}

// ------------------------------------------------------------------------- HOME SUBMIT URL FORM

function initSubmitUrlForm() {
	const form = document.querySelector(".js-analysis-submit-form");
	if (!form) return;

	form.addEventListener("submit", function (e) {
		e.preventDefault();

		const url = e.target.querySelector("input[name='siteurl']").value;
		launchAnalysisByURL(url);
	});
}

async function launchAnalysisByURL(url) {
	try {
		await AnalysisService.launchAnalysisByURL(url);
		updateFormMessages({ success: true });
	} catch (error) {
		updateFormMessages({ success: false, error });
	}
}

// TODO improve error handling
function updateFormMessages(options) {
	const form = document.querySelector(".js-analysis-submit-form");
	if (options.success) {
		form.setAttribute("aria-invalid", "false");
	} else {
		const errorMessage = "{{ i18n `EcoIndexFormInputInvalid` }}";
		if (!form.querySelector(".form-error")) {
			form.insertAdjacentHTML("afterbegin", `<p class="form-error">${errorMessage}</p>`);
		}
		form.setAttribute("aria-invalid", "true");
	}
}
