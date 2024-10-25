let dataTable;
let originalData;

document.addEventListener("DOMContentLoaded", function () {
  fetch("isps.json")
    .then((response) => response.json())
    .then((data) => {
      originalData = data;
      initializeTable(data);
      initializeFilters(data);
    })
    .catch((error) => console.error("Error loading ISP data:", error));
});

function initializeTable(data) {
  dataTable = new simpleDatatables.DataTable("#ispsTable", {
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
    perPageSelect: [10, 15, 20, 25, 50],
    columns: [
      { select: 0, sort: "asc" },
      { select: [1, 2, 3, 4, 5], sortable: false },
    ],
  });
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

function initializeFilters(data) {
  // Populate province filter
  const provinces = [
    ...new Set(data.isps.flatMap((isp) => isp.provinces)),
  ].sort();
  populateSelect("provinceFilter", provinces);

  // Populate FNO filter
  const fnos = [...new Set(data.isps.flatMap((isp) => isp.fnos))].sort();
  populateSelect("fnoFilter", fnos);

  // Add event listeners to all filters
  [
    "provinceFilter",
    "fnoFilter",
    "ipv6Filter",
    "noCgnatFilter",
    "fibreOnlyFilter",
  ].forEach((filterId) => {
    document
      .getElementById(filterId)
      .addEventListener("change", () => applyFilters());
  });
}

function populateSelect(elementId, options) {
  const select = document.getElementById(elementId);
  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });
}

function applyFilters() {
  const selectedProvince = document.getElementById("provinceFilter").value;
  const selectedFNO = document.getElementById("fnoFilter").value;
  const ipv6Only = document.getElementById("ipv6Filter").checked;
  const noCgnat = document.getElementById("noCgnatFilter").checked;
  const fibreOnly = document.getElementById("fibreOnlyFilter").checked;

  const filteredData = originalData.isps.filter((isp) => {
    const provinceMatch =
      !selectedProvince || isp.provinces.includes(selectedProvince);
    const fnoMatch = !selectedFNO || isp.fnos.includes(selectedFNO);
    const ipv6Match = !ipv6Only || isp.ipv6;
    const cgnatMatch = !noCgnat || !isp.cgnat;
    const fibreMatch = !fibreOnly || isp.fibreOnly;

    return provinceMatch && fnoMatch && ipv6Match && cgnatMatch && fibreMatch;
  });

  // Update table with filtered data
  dataTable.destroy();
  initializeTable({ isps: filteredData });
}
