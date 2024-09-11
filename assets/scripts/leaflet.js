let map = L.map("map").setView([-34.12612, 150.81789], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

L.marker([-34.12612, 150.81789])
  .addTo(map)
  .bindPopup("Lakhbatti PTY. LTD.")
  .openPopup();
