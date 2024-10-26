import { DataTable } from "simple-datatables";

var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

// Change the icons inside the button based on previous settings
if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  themeToggleLightIcon.classList.remove("hidden");
} else {
  themeToggleDarkIcon.classList.remove("hidden");
}

var themeToggleBtn = document.getElementById("theme-toggle");

themeToggleBtn.addEventListener("click", function () {
  // toggle icons inside button
  themeToggleDarkIcon.classList.toggle("hidden");
  themeToggleLightIcon.classList.toggle("hidden");

  // if set via local storage previously
  if (localStorage.getItem("color-theme")) {
    if (localStorage.getItem("color-theme") === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }

    // if NOT set via local storage previously
  } else {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("isps.json")
    .then((response) => response.json())
    .then((data) => initializeTable(data))
    .catch((error) => console.error("Error loading ISP data:", error));
});

function initializeTable(data) {
  const table = new DataTable("#ispsTable", {
    data: {
      headings: [
        "ISP Name",
        "Coverage",
        "Ratings",
        "Technical",
        "Business Info",
        "Features",
      ],
      data: formatTableData(data.isps),
    },
    searchable: true,
    sortable: true,
    perPage: 15,
  });

  initializeFilters(data, table);
}

function formatTableData(isps) {
  return isps.map((isp) => [
    isp.name,
    formatCoverage(isp),
    formatRatings(isp),
    formatTechnical(isp),
    formatBusiness(isp),
    formatFeatures(isp),
  ]);
}

function formatCoverage(isp) {
  return `
        <div class="text-sm">
            <div><strong>Provinces:</strong> ${isp.provinces.join(", ")}</div>
            <div><strong>FNOs:</strong> ${isp.fnos.join(", ")}</div>
        </div>
    `;
}

function formatRatings(isp) {
  const googleStars = isp.googleRating
    ? "⭐".repeat(Math.round(isp.googleRating))
    : "N/A";
  const helloStars = isp.helloPeterRating
    ? "⭐".repeat(Math.round(isp.helloPeterRating))
    : "N/A";

  return `
        <div class="text-sm">
            <div>Google: ${googleStars}</div>
            <div>HelloPeter: ${helloStars}</div>
        </div>
    `;
}

function formatTechnical(isp) {
  return `
        <div class="text-sm">
            <span class="badge ${isp.ipv6 ? "badge-success" : "badge-danger"}">
                IPv6: ${isp.ipv6 ? "Yes" : "No"}
            </span>
            <span class="badge ${!isp.cgnat ? "badge-success" : "badge-warning"}">
                CGNAT: ${isp.cgnat ? "Yes" : "No"}
            </span>
            <div>${isp.connectionType}</div>
        </div>
    `;
}

function formatBusiness(isp) {
  return `
        <div class="text-sm">
            <div>${isp.yearsInBusiness} years</div>
            <div>${isp.size} size</div>
            ${isp.founderRun ? '<div class="badge badge-success">Founder Run</div>' : ""}
        </div>
    `;
}

function formatFeatures(isp) {
  return `
        <div class="text-sm">
            ${isp.fibreOnly ? '<span class="badge badge-success">Fibre Only</span>' : ""}
            ${isp.communityForum ? '<span class="badge badge-success">Community Forum</span>' : ""}
            ${isp.ecsOnly ? '<span class="badge badge-success">ECS Only</span>' : ""}
        </div>
    `;
}

function initializeFilters(data, table) {
  const provinces = [
    ...new Set(data.isps.flatMap((isp) => isp.provinces)),
  ].sort();
  const provinceFilter = document.getElementById("provinceFilter");
  provinces.forEach((province) => {
    const option = document.createElement("option");
    option.value = province;
    option.textContent = province;
    provinceFilter.appendChild(option);
  });

  const fnos = [...new Set(data.isps.flatMap((isp) => isp.fnos))].sort();
  const fnoFilter = document.getElementById("fnoFilter");
  fnos.forEach((fno) => {
    const option = document.createElement("option");
    option.value = fno;
    option.textContent = fno;
    fnoFilter.appendChild(option);
  });

  const filters = [
    "provinceFilter",
    "fnoFilter",
    "ipv6Filter",
    "noCgnatFilter",
    "fibreOnlyFilter",
  ];
  filters.forEach((filterId) => {
    document.getElementById(filterId).addEventListener("change", () => {
      applyFilters(table, data);
    });
  });
}

function applyFilters(table, data) {
  const selectedProvince = document.getElementById("provinceFilter").value;
  const selectedFNO = document.getElementById("fnoFilter").value;
  const ipv6Only = document.getElementById("ipv6Filter").checked;
  const noCgnat = document.getElementById("noCgnatFilter").checked;
  const fibreOnly = document.getElementById("fibreOnlyFilter").checked;

  const filteredData = data.isps.filter((isp) => {
    const provinceMatch =
      !selectedProvince || isp.provinces.includes(selectedProvince);
    const fnoMatch = !selectedFNO || isp.fnos.includes(selectedFNO);
    const ipv6Match = !ipv6Only || isp.ipv6;
    const cgnatMatch = !noCgnat || !isp.cgnat;
    const fibreMatch = !fibreOnly || isp.fibreOnly;

    return provinceMatch && fnoMatch && ipv6Match && cgnatMatch && fibreMatch;
  });

  table.destroy();
  initializeTable({ isps: filteredData });
}
