document.addEventListener('DOMContentLoaded', () => {
    // Simulate query execution delay for visual effect
    setTimeout(() => {
        fetchProjects();
    }, 800);
});

async function fetchProjects() {
    const tableBody = document.getElementById('db-tbody');
    const resultText = document.getElementById('query-result-count');
    
    const startTime = performance.now();
    
    try {
        const response = await fetch('http://localhost:3000/api/projects');
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        const projects = data.data;
        
        const endTime = performance.now();
        const fetchTime = Math.round(endTime - startTime);
        
        if (projects && projects.length > 0) {
            tableBody.innerHTML = ''; // Clear loading text
            
            projects.forEach(project => {
                const tr = document.createElement('tr');
                
                tr.innerHTML = `
                    <td>${project.id}</td>
                    <td>${project.title}</td>
                    <td>${project.description}</td>
                `;
                
                tableBody.appendChild(tr);
            });
            
            resultText.innerText = `${projects.length} rows returned in ${fetchTime}ms.`;
        } else {
            tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">0 rows returned.</td></tr>';
            resultText.innerText = `0 rows returned in ${fetchTime}ms.`;
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
        tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #ff5f56;">Error executing query. Is the backend running?</td></tr>';
        resultText.innerText = `Query failed.`;
    }
}
