function simulasiLRU() {
    const pageInput = document.getElementById('page-input').value;
    const frameInput = document.getElementById('frame-input').value;
    const pages = pageInput.split(' ').map(page => parseInt(page.trim()));
    const cacheSize = parseInt(frameInput);
    const simulationResult = cacheSimulasiLRU(pages, cacheSize);
    displayOutput(simulationResult, pages);
}




function cacheSimulasiLRU(pages, cacheSize) {
    let pageFaults = 0;
    let cache = [];
    const simulationSteps = [];

    function updateCache(page) {
        cache = cache.filter(p => p !== page);
        cache.push(page);
    }

    for (const page of pages) {
        const step = {
            page: page,
            cacheState: [...cache],
        };

        if (!cache.includes(page)) {
            pageFaults++;

            if (cache.length === cacheSize) {
                cache.shift();
            }
        } else {
            updateCache(page);
        }

        updateCache(page);

        simulationSteps.push(step);
    }

    return {
        pageFaults: pageFaults,
        simulationSteps: simulationSteps,
    };
}




function displayOutput(simulationResult, pages) {
    const outputDiv = document.getElementById('output');
    const { pageFaults, simulationSteps } = simulationResult;

    const totalReferences = pages.length;
    const totalDistinctReferences = new Set(pages).size;
    const hits = totalReferences - pageFaults;
    const hitRate = (hits / totalReferences) * 100;
    const faultRate = (pageFaults / totalReferences) * 100;

    let tableHtml = `
        <p>Total References: ${totalReferences}</p>
        <p>Total Distinct References: ${totalDistinctReferences}</p>
        <p>Hits: ${hits}</p>
        <p>Faults: ${pageFaults}</p>
        <p>Hit Rate: ${hitRate.toFixed(2)}%</p>
        <p>Fault Rate: ${faultRate.toFixed(2)}%</p>
        <table>
            <tr>
                <th>Step</th>
                <th>Page</th>
                <th>LRU Cache State</th>
                <th>Hit/Miss</th>
            </tr>
    `;

    simulationSteps.forEach((step, index) => {
        const hitOrMiss = cacheHit(pages, index, step.cacheState) ? '✓' : '✗';
        tableHtml += `
            <tr>
                <td>${index + 1}</td>
                <td>${step.page}</td>
                <td>${step.cacheState.join(', ')}</td>
                <td>${hitOrMiss}</td>
            </tr>
        `;
    });

    tableHtml += `</table>`;
    outputDiv.innerHTML = tableHtml;
}


function cacheHit(pages, currentIndex, cacheState) {
    const currentReference = pages[currentIndex];
    return cacheState.includes(currentReference);
}
