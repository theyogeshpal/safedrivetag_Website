const fs = require('fs');

const path = 'src/pages/dashboard/DashboardOrders.jsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('const [expandedOrder, setExpandedOrder] = useState(null);')) {
  content = content.replace(
    'const [digitalPassModalOrder, setDigitalPassModalOrder] = useState(null);',
    'const [digitalPassModalOrder, setDigitalPassModalOrder] = useState(null);\n    const [expandedOrder, setExpandedOrder] = useState(null);'
  );
}

content = content.replace(
  'setDigitalPassModalOrder(ord);',
  'setExpandedOrder(expandedOrder === ord._id ? null : ord._id);'
);

content = content.replace(
  '<Eye size={13} /> View Digital Pass',
  '<Eye size={13} /> {expandedOrder === ord._id ? \\'Hide Digital Pass\\' : \\'View Digital Pass\\'}'
);

fs.writeFileSync(path, content, 'utf8');
