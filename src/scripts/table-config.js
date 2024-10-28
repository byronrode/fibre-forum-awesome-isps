import { DataTable } from "simple-datatables";
import Papa from "papaparse";

const sheetId = "1kwir7Q9t28lFvBvV5koRSzgliQfafh8PL-GLJRkf6rA";
const gid = "0";
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

document.addEventListener("DOMContentLoaded", function () {
  fetch(url)
    .then((response) => response.text())
    .then((csvText) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: "greedy",
        transformHeader: (header) => header.trim(),
        transform: (value) => value.trim(),
        complete: function (results) {
          // Filter out rows without an ISP Name or where all values are empty
          const validData = results.data.filter((row) => {
            return (
              row["ISP Name"] &&
              Object.values(row).some((value) => value && value.trim() !== "")
            );
          });

          const data = {
            isps: validData.map((row) => ({
              name: row["ISP Name"],
              asNumber: row["AS Number"],
              provinces: row["Province List"]
                ? row["Province List"].split(",").map((p) => p.trim())
                : [],
              fnos: row["FNO Connected List"]
                ? row["FNO Connected List"].split(",").map((f) => f.trim())
                : [],
              googleRating: parseFloat(row["Google Rating"]) || 0,
              googleRatingCount: parseInt(row["Google Rating Count"]) || 0,
              helloPeterRating: parseFloat(row["Hello Peter Rating"]) || 0,
              connectionType: row["DHCP"] === "Y" ? "DHCP" : "PPPoE",
              ipv6: row["IPv6"] === "Y",
              cgnat: row["No CGNAT"] !== "Y",
              manrs: row["MANRS/RPKI"] === "Y",
              size: row["Size"],
              founderRun: row["Founder Run"] === "Y",
              yearsInBusiness: parseInt(row["Years Running"]) || 0,
              fibreOnly: row["Fibre Only"] === "Y",
              communityForum: row["Community Forum"] === "Y",
              ecsOnly: row["ECS only"] === "Y",
              support: {
                phone: row["Phone Support"] === "Y",
                email: row["Email Support"] === "Y",
                im: row["IM Support"] === "Y",
              },
              upstreamAsns: row["Upstream ASNs"]
                ? row["Upstream ASNs"]
                    .split(",")
                    .map((asn) => asn.trim())
                    .filter((asn) => asn)
                : [],
            })),
          };

          if (data.isps.length > 0) {
            initializeTable(data);
          } else {
            console.error("No valid ISP data found");
          }
        },
        error: function (error) {
          console.error("Error parsing CSV:", error);
        },
      });
    });
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
    footer: true,
    header: true,
    searchable: true,
    sortable: true,
    paging: true,
    perPage: 10,
    perPageSelect: [5, 10, 20, 50],
    firstLast: true,
    nextPrev: true,
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

function formatTechnical(isp) {
  return `
    <div class="text-sm">
      <span class="badge ${isp.ipv6 ? "badge-success" : "badge-danger"}">
        IPv6: ${isp.ipv6 ? "Yes" : "No"}
      </span>
      <span class="badge ${!isp.cgnat ? "badge-success" : "badge-warning"}">
        CGNAT: ${isp.cgnat ? "Yes" : "No"}
      </span>
      <div>AS${isp.asNumber}</div>
      <div>${isp.connectionType}</div>
      ${isp.manrs ? '<span class="badge badge-success">MANRS/RPKI</span>' : ""}
    </div>
  `;
}

function formatRatings(isp) {
  const googleStars = isp.googleRating
    ? `⭐${isp.googleRating.toFixed(1)} (${isp.googleRatingCount})`
    : "N/A";
  const helloStars = isp.helloPeterRating
    ? `⭐${isp.helloPeterRating.toFixed(1)}`
    : "N/A";

  return `
    <div class="text-sm">
      <div>Google: ${googleStars}</div>
      <div>HelloPeter: ${helloStars}</div>
    </div>
  `;
}

function formatBusiness(isp) {
  return `
    <div class="text-sm">
      <div>${isp.yearsInBusiness} years</div>
      <div>${isp.size} size</div>
      ${isp.founderRun ? '<div class="badge badge-success">Founder Run</div>' : ""}
      <div class="mt-1">
        ${isp.support.phone ? '<span class="badge badge-info">Phone</span>' : ""}
        ${isp.support.email ? '<span class="badge badge-info">Email</span>' : ""}
        ${isp.support.im ? '<span class="badge badge-info">IM</span>' : ""}
      </div>
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
