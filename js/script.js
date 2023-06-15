

let showAllData = false;
let infos = [];

// loading all data
const loadData = async () => {
    try {

        const res = await fetch('https://openapi.programming-hero.com/api/ai/tools');
        const data = await res.json();
        infos = data.data.tools;


        displayData(infos);
    } catch (error) {
        console.error(error);
    }
}
// displaying data

const displayData = infos => {
    document.getElementById('sort-btn').addEventListener('click', function () {
        const sortedData = infos.sort((a, b) => new Date(b.published_in) - new Date(a.published_in)); //sorting descending
        displayData(sortedData); 
    });
    const infosContainer = document.getElementById('infos-container');
    const seeMore = document.getElementById('see-more');
    // clear previous data
    infosContainer.innerHTML = '';
    if (infos.length > 6 && !showAllData) {
        slicedInfos = infos.slice(0, 6);
        seeMore.classList.remove('hidden');
    } else {
        slicedInfos = infos;
        seeMore.classList.add('hidden');
    }
    slicedInfos.forEach(info => {
        const singleInfoContainer = document.createElement('div');
        singleInfoContainer.innerHTML =
            `  
            <div class="card w-96  bg-black text-white shadow-xl">
              <figure><img class="h-[300px]" src="${info.image}"  /></figure>
              <div class="card-body">
                <h2 class="card-title">Features</h2>
                <ul>
                  ${info.features.map((feature, index) => `<li>${index + 1}. ${feature}</li>`).join('')}
                </ul>
                <div class="divider"></div> 
                <div> 
                  <div>
                    <h1 class="text-2xl font-bold">${info.name}</h1>
                    <p><i class="fa-solid fa-calendar-days"></i> ${info.published_in}</p>
                  </div>
                  <div class="card-actions justify-end">
                 
                    <!-- The button to open modal -->
                    <label  onClick="loadDetails('${info.id}')" for="detailModal" class="hover:bg-red-400 rounded-full p-3" ><i class="fa-solid text-red-600 fa-arrow-right"></i></label>
                     
                   
                  </div>
                </div>
              </div>
            </div>
            `

        infosContainer.appendChild(singleInfoContainer);

    });
    // stop loader
    toggleLoader(false, 'loader');
}


// loader 
const toggleLoader = (isLoading, id) => {
    const loader = document.getElementById(id);
    if (isLoading) {
        loader.classList.remove('hidden');
    } else {
        loader.classList.add('hidden');
    }
}
//see more btn 
const seeMoreBtn = document.getElementById('btn-see-more');
seeMoreBtn.addEventListener('click', function () {
    showAllData = true;
    loadData();
});

//loading details
const loadDetails = id => {

    fetch(`https://openapi.programming-hero.com/api/ai/tool/${id}`)
        .then(res => res.json())
        .then(data => displayDetails(data.data))


}
const updateElement = (elementId, value) => {
    const element = document.getElementById(elementId);
    element.innerText = value;
}

const displayDetails = info => {
    updateElement('ai-description', info.description);
    const aiImage = document.getElementById('ai-image');
    aiImage.src = info.image_link[0]

    updateElement('ai-input', info.input_output_examples?.[0].input ? info.input_output_examples[0].input : 'Can you give any example?');

    updateElement('ai-output', info.input_output_examples?.[0].output ? info.input_output_examples[0].output : 'No! Not yet! Take a break');
    const accuracy = document.getElementById('accuracy');
    if (info.accuracy.score == null) {
        accuracy.classList.add('hidden')

    } else {
        accuracy.classList.remove('hidden')
        accuracy.innerText = info.accuracy.score * 100 + '% accuracy';
    }
    const plansContainer = document.getElementById('plans-container');

    plansContainer.innerHTML =
        `
    <div class="bg-white rounded-xl">
    <p class="text-green-500 font-bold   lg:py-2">${info.pricing?.[0].price ? info.pricing?.[0].price : 'Free of cost  '}  <br> ${info.pricing?.[0].plan ? info.pricing?.[0].plan : 'Basic'}</p>
    </div>
    <div  class="bg-white rounded-xl">
    <p class="text-orange-500 font-bold    lg:py-2">${info.pricing?.[1].price ? info.pricing?.[1].price : 'Free of cost'} <br> ${info.pricing?.[1].plan ? info.pricing?.[1].plan : 'Monthly'}</p>
    </div>
    <div class="bg-white rounded-xl mb-2">
    <p class="text-red-500 font-bold    ">${info.pricing?.[2].price ? info.pricing?.[2].price : 'Free of cost'} <br> ${info.pricing?.[2].plan ? info.pricing?.[2].plan : 'Enterprise'}</p>
    </div>
    `
    const featuresAndIntegrations = document.getElementById('features-and-integrations');
    featuresAndIntegrations.innerHTML =
        `
        <div class="p-5">
        <h2 class="font-bold text-xl">Features</h2>
        <ul>
       
         ${info.features && Object.keys(info.features).map(key => `<li>• ${info.features[key].feature_name}</li>`).join('')}
      </ul>
        </div>
        <div  class="p-5 ">
        <h2 class="font-bold text-xl">Integrations </h2>
        <ul>
        ${info.integrations
            ? info.integrations.map((integration) => `<li>• ${integration}</li>`).join('')
            : 'No data found'
        }
        
      </ul>
        </div>

    `


}


toggleLoader(true, 'loader');
loadData()