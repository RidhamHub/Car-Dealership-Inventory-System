// Pick a car photo for a vehicle based on its make, then category, then a
// sensible default. If a URL ever fails to load, VehicleCard shows a branded
// gradient fallback instead, so a broken image never appears.
const byMake = {
  toyota: "1621007947382-bb3c3994e3fb",
  honda: "1606664515524-ed2f786a0bd6",
  ford: "1552519507-da3b142c6e3d",
  tesla: "1560958089-b8a1929cea89",
  hyundai: "1619767886558-efdc259cde1a",
  bmw: "1555215695-3004980ad54e",
};

const byCategory = {
  suv: "1519641471654-76ce0107ad1b",
  sedan: "1550355291-bbee04a92027",
  coupe: "1544829099-b9a0c07fad1a",
  truck: "1558618666-fcd25c85cd64",
};

const fallback = "1503376780353-7e6692767b70";

export function vehicleImage(vehicle) {
  const id =
    byMake[vehicle.make?.toLowerCase()] ||
    byCategory[vehicle.category?.toLowerCase()] ||
    fallback;
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;
}
