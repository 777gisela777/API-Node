document.querySelectorAll("[esborrar]").forEach(button => {
  button.addEventListener("click", async () => {
    if (!confirm("Segur que vols eliminar el llibre?")) return;

    const id = button.getAttribute("esborrar");
    const response = await fetch(`/books/${id}`, { method: "DELETE" });

    if (response.ok) {
      button.closest("[llibre]").remove();
    } else {
      alert("No s'ha eliminat el llibre");
    }
  });
});