const fs = require('fs');
const path = 'src/pages/dashboard/DashboardOrders.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '<Eye size={13} /> {expandedOrder === ord._id ? \\'Hide Digital Pass\\' : \\'View Digital Pass\\'}',
  '<Eye size={13} /> View Digital Pass'
);

content = content.replace(
  '<Eye size={13} /> View Digital Pass',
  '<Eye size={13} /> {expandedOrder === ord._id ? "Hide Digital Pass" : "View Digital Pass"}'
);

fs.writeFileSync(path, content, 'utf8');
