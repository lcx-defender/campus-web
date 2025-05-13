let icons = [];
const modules = import.meta.glob('./../../assets/icons/svg/*.svg');

for (const path in modules) {
  const iconName = path.split('/').pop().replace('.svg', '');
  icons.push(iconName);
};

export default icons