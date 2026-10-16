document.querySelectorAll("[esborrar]").forEach(button => {
  button.addEventListener("click", async () => {
    if (!confirm("Segur que vols eliminar el manga?")) return;

    const id = button.getAttribute("esborrar");
    const response = await fetch(`/mangas/${id}`, { method: "DELETE" });

    if (response.ok) {
      button.closest("[manga]").remove();
    } else {
      alert("No s'ha eliminat el manga");
    }
  });
});