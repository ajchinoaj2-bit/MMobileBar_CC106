import { Packages as defaultPackages } from '../constants/Packages';

const STORAGE_KEY = 'mmb_packages';

export function getPackages() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPackages));
    return defaultPackages;
  }
  return JSON.parse(stored);
}

function savePackages(packages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
}

export function addPackage(pkg) {
  const packages = getPackages();
  const newPackage = {
    id: packages.length ? Math.max(...packages.map((p) => p.id)) + 1 : 1,
    perks: [],
    ...pkg,
  };
  packages.push(newPackage);
  savePackages(packages);
  return newPackage;
}

export function updatePackage(id, updates) {
  const packages = getPackages();
  savePackages(packages.map((p) => (p.id === id ? { ...p, ...updates } : p)));
}

export function deletePackage(id) {
  const packages = getPackages();
  savePackages(packages.filter((p) => p.id !== id));
}