const getElementById = (id) => {
  return document.getElementById(id);
};

const allBtn = getElementById("all-btn");
const openBtn = getElementById("open-btn");
const closeBtn = getElementById("close-btn");

let activeTab = "all";
handleTabChange(activeTab);
let totalIssue;
function handleTabChange(tab) {
  activeTab = tab;

  allBtn.classList.remove("btn-primary");
  openBtn.classList.remove("btn-primary");
  closeBtn.classList.remove("btn-primary");

  if (activeTab === "all") {
    allBtn.classList.add("btn-primary");
  }
  if (activeTab === "open") {
    openBtn.classList.add("btn-primary");
  }
  if (activeTab === "closed") {
    closeBtn.classList.add("btn-primary");
  }

  if (activeTab === null) {
    return;
  }
  loadData(tab);
}

allBtn.addEventListener("click", () => {
  handleTabChange("all");
});
openBtn.addEventListener("click", () => {
  handleTabChange("open");
});
closeBtn.addEventListener("click", () => {
  handleTabChange("closed");
});

function showLoader(){
  
}

async function loadData(activeStatus) {
  const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        "Request Failed. Something went wrong. Please try again!",
      );
    }
    const issue = await response.json();

    if (activeStatus === "all") {
      totalIssue = issue.data.length;
      displayData(issue.data);
      return;
    }
    const filteredData = issue.data.filter(
      (issue) => issue.status === activeStatus,
    );
    totalIssue = filteredData.length;

    displayData(filteredData);
  } catch (error) {
    showError();
    console.log(error);
  }
}

getElementById("searchBtn").addEventListener("click", () => {
  const inputText = getElementById("searchInput").value;

  searchIssues(inputText);
});

function showError() {
  const issueDisplaySection = getElementById("issue-Display-Section");
  const issueTab = getElementById("issueTab");
  issueDisplaySection.innerHTML = "";
  issueTab.innerHTML = "";

  const warrningCard = document.createElement("div");
  warrningCard.innerHTML = `
<p class="text-2xl text-center font-bold">
  Something went wrong. Please try again!
</p>
`;
  issueDisplaySection.appendChild(warrningCard);
}

const searchIssues = async (searchText) => {
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(searchText)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Something Went Wrong. Please Try again!");
    }
    const issues = await response.json();
    totalIssue = issues.data.length;
    activeTab = null;
    handleTabChange(activeTab);
    displayData(issues.data);
  } catch (error) {
    showError();
    console.log(error);
  }
};
async function showModal(id) {
  const modalContainer = getElementById("modal-container");
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    my_modal_5.showModal();
    const issue = await response.json();

    const issueDetail = document.createElement("div");

    issueDetail.innerHTML = ``;
  } catch (error) {
    console.log(error);
    showError();
  }
}
const displayData = (data) => {
  const issueContainer = getElementById("issues-container");
  issueContainer.innerHTML = "";
  getElementById("total-issue-count").innerHTML = totalIssue;
  data.forEach((element) => {
    const cardWrapper = document.createElement("div");

    cardWrapper.innerHTML = `
    
    <!-- issue card  -->
          <div onclick="showModal(${element.id})" id="${element.id}"
            class="card cursor-pointer border-t-4 ${element.status === "open" ? "border-success" : "border-[#A855F7]"}  flex flex-col justify-start items-center rounded shadow"
          >
            <!-- card top -->
            <div class="p-4 space-y-3 w-full">
              <!-- 1 no div -->
              <div class="flex justify-between items-center w-full">
                <img src=${element.status === "open" ? `"./assets/Open-Status.png"` : `"./assets/ClosedStatus.png"`} alt="" />
                <p
                  class="${
                    element.priority === "high"
                      ? "text-error"
                      : element.priority === "medium"
                        ? "text-[#F59E0B]"
                        : "text-[#9CA3AF]"
                  } py-[6px] text-xs w-[80px] uppercase text-center rounded-full ${
                    element.priority === "high"
                      ? "bg-[#FEECEC]"
                      : element.priority === "medium"
                        ? "bg-[#FFF6D1]"
                        : "bg-[#EEEFF2]"
                  }"
                >
                  ${element.priority}
                </p>
              </div>

              <!-- 2 no div -->
              <div class="space-y-3">
                <!-- card text wrap -->
                <div class="space-y-2">
                  <h6 class="text-sm">${element.title}</h6>
                  <p class="text-xs text-neutral-500">
                    ${element.description}
                  </p>
                </div>
                <!-- card label wrapper -->
                <div class="flex gap-1 w-full flex-wrap">
                 ${element.labels
                   .map((label) => {
                     return `<p
                    class="flex justify-start items-center max-w-fit gap-1 ${label === "bug" ? "text-error" : label === "help wanted" ? "text-[#D97706]" : "text-[#d96c06]"}  py-[6px] px-2 text-xs uppercase text-center rounded-full ${label === "bug" ? "bg-[#FEECEC]" : label === "help wanted" ? "bg-[#FFF8DB]" : "bg-green-200"} border ${label === "bug" ? "border-error" : label === "help wanted" ? "border-[#D97706]" : "border-green-500"} "
                  >
                    <img src="./assets/BugDroid.png" alt="" /> ${label}
                  </p> `;
                   })
                   .join("")}
                  
                </div>
              </div>
            </div>

            <!--card bottom div  -->
            <div
              class="p-4 text-left w-full space-y-2 border-t border-t-neutral-300"
            >
              <p class="text-xs text-neutral-500">#${element.id} by ${element.author}</p>
              <p class="text-xs text-neutral-500">${new Date(element.createdAt).toLocaleDateString("en-US")}</p>
            </div>
          </div>
          <!-- issue card end here  -->
          
    `;
    issueContainer.appendChild(cardWrapper);
  });
};
