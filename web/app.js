const { $, escapeHtml } = window.Postovaya.utils;
const { STORAGE, DEFAULT_POST_STYLES, state, save, audiencesForVenue } = window.Postovaya.store;
const api = window.Postovaya.api;

const els = {
  venue: $("#venueSelect"), audience: $("#audienceSelect"), context: $("#contextPreview"),
  topic: $("#topicInput"), materials: $("#materialsInput"), materialsCount: $("#materialsCount"),
  postStyle: $("#postStyleSelect"), form: $("#composerForm"),
  generate: $("#generateButton"), error: $("#formError"), empty: $("#emptyState"),
  loading: $("#loadingState"), editorState: $("#editorState"), result: $("#resultEditor"),
  resultCount: $("#resultCount"), demo: $("#demoBanner"), saveState: $("#saveState"),
  imageInput: $("#imageInput"), imageChip: $("#imageChip"), imageThumb: $("#imageThumb"),
  imageName: $("#imageName"), resultImage: $("#resultImage"), attached: $("#attachedPreview"),
  drafts: $("#draftList"), draftCount: $("#draftCount"), aiStatus: $("#aiStatus"),
  navDraftCount: $("#navDraftCount"), draftSearch: $("#draftSearch"),
  profilesView: $("#profilesView"), editorView: $("#editorView"), draftsView: $("#draftsView"),
  sidebarToggle: $("#sidebarToggle"), venueTree: $("#venueTree"), profileName: $("#profileName"),
  profileFormat: $("#profileFormat"), profileCurrentGuests: $("#profileCurrentGuests"),
  profileDesiredGuests: $("#profileDesiredGuests"),
  venueDialog: $("#venueDialog"), audienceDialog: $("#audienceDialog"),
  audienceName: $("#audienceName"), audiencePortrait: $("#audiencePortrait"), audienceNeeds: $("#audienceNeeds"),
};

function renderSelects() {
  const currentVenue = els.venue.value;
  const currentAudience = els.audience.value;
  els.venue.innerHTML = state.venues.length
    ? state.venues.map(item => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join("")
    : '<option value="">Сначала добавьте заведение</option>';
  els.venue.disabled = !state.venues.length;
  if (state.venues.some(x => x.id === currentVenue)) els.venue.value = currentVenue;
  renderAudienceSelect(currentAudience);
  renderContext();
}

function renderAudienceSelect(preferredId = "") {
  const audiences = audiencesForVenue(els.venue.value);
  els.audience.innerHTML = audiences.length
    ? audiences.map(item => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join("")
    : '<option value="">У этого заведения пока нет аудиторий</option>';
  els.audience.disabled = !audiences.length;
  if (audiences.some(item => item.id === preferredId)) els.audience.value = preferredId;
}

function renderPostStyles() {
  const venue = state.venues.find(item => item.id === els.venue.value);
  const styles = venue?.recommendedStyles?.length ? venue.recommendedStyles : DEFAULT_POST_STYLES;
  const current = els.postStyle.value;
  els.postStyle.innerHTML = styles.map(style => `<option value="${escapeHtml(style)}">${escapeHtml(style)}</option>`).join("");
  if (styles.includes(current)) els.postStyle.value = current;
}

function renderContext() {
  const venue = state.venues.find(item => item.id === els.venue.value);
  const audience = state.audiences.find(item => item.id === els.audience.value && item.venueId === venue?.id);
  const chips = [venue?.description, audience?.needs].filter(Boolean);
  els.context.innerHTML = chips.map(value => `<span>${escapeHtml(value.length > 75 ? value.slice(0, 75) + "…" : value)}</span>`).join("");
  renderPostStyles();
}

function renderDrafts(query = "") {
  const normalized = query.trim().toLocaleLowerCase("ru-RU");
  const drafts = state.drafts.filter(draft => {
    const haystack = `${draft.topic} ${draft.venue} ${draft.audience} ${draft.text}`.toLocaleLowerCase("ru-RU");
    return !normalized || haystack.includes(normalized);
  });
  els.draftCount.textContent = state.drafts.length;
  els.navDraftCount.textContent = state.drafts.length;
  if (!drafts.length) {
    els.drafts.innerHTML = `<p class="muted">${normalized ? "По вашему запросу ничего не найдено." : "Сохранённых черновиков пока нет."}</p>`;
    return;
  }
  els.drafts.innerHTML = drafts.map(draft => {
    const index = state.drafts.indexOf(draft);
    return `
    <button class="draft-item" type="button" data-draft="${index}">
      <span><strong>${escapeHtml(draft.topic || "Без темы")}</strong>
      <small>${escapeHtml(draft.venue)} · ${escapeHtml(draft.audience || "Аудитория не указана")}</small></span>
      <time>${new Date(draft.createdAt).toLocaleDateString("ru-RU")}</time>
    </button>`;
  }).join("");
}

function switchView(view) {
  els.profilesView.classList.toggle("hidden", view !== "profiles");
  els.editorView.classList.toggle("hidden", view !== "editor");
  els.draftsView.classList.toggle("hidden", view !== "drafts");
  document.querySelectorAll("[data-view]").forEach(button => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  if (view === "profiles") renderProfiles();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setSidebarCollapsed(collapsed) {
  document.body.classList.toggle("sidebar-collapsed", collapsed);
  els.sidebarToggle.textContent = collapsed ? "☰" : "‹";
  els.sidebarToggle.setAttribute("aria-label", collapsed ? "Показать боковую панель" : "Скрыть боковую панель");
  els.sidebarToggle.title = collapsed ? "Показать боковую панель" : "Скрыть боковую панель";
  localStorage.setItem(STORAGE.sidebarCollapsed, collapsed ? "true" : "false");
}

function setView(name) {
  els.empty.classList.toggle("hidden", name !== "empty");
  els.loading.classList.toggle("hidden", name !== "loading");
  els.editorState.classList.toggle("hidden", name !== "editor");
}

function selectedPayload() {
  return {
    venue: state.venues.find(item => item.id === els.venue.value),
    audience: state.audiences.find(item => item.id === els.audience.value),
    topic: els.topic.value.trim(), materials: els.materials.value.trim(),
    postStyle: els.postStyle.value,
  };
}

async function generate(event) {
  event.preventDefault();
  els.error.classList.add("hidden");
  if (!state.venues.length || !audiencesForVenue(els.venue.value).length) {
    els.error.textContent = "Сначала добавьте заведению хотя бы одну аудиторию.";
    els.error.classList.remove("hidden");
    switchView("profiles");
    return;
  }
  setView("loading");
  els.generate.disabled = true;
  try {
    const data = await api.generatePost(selectedPayload());
    els.result.value = data.text;
    els.demo.classList.toggle("hidden", !data.demo);
    els.saveState.textContent = "Не сохранён";
    updateResultCount();
    syncResultImage();
    setView("editor");
  } catch (error) {
    setView("empty");
    els.error.textContent = error.message;
    els.error.classList.remove("hidden");
  } finally {
    els.generate.disabled = false;
  }
}

function updateResultCount() {
  els.resultCount.textContent = `${els.result.value.length.toLocaleString("ru-RU")} знаков`;
  els.saveState.textContent = "Есть изменения";
}

function syncResultImage() {
  if (state.imageUrl) {
    els.resultImage.src = state.imageUrl;
    els.attached.classList.remove("hidden");
  } else {
    els.attached.classList.add("hidden");
  }
}

function removeImage() {
  if (state.imageUrl) URL.revokeObjectURL(state.imageUrl);
  state.imageUrl = null;
  state.imageName = "";
  els.imageInput.value = "";
  els.imageChip.classList.add("hidden");
  syncResultImage();
}

function saveDraft() {
  if (!els.result.value.trim()) return;
  const payload = selectedPayload();
  state.drafts.unshift({
    topic: payload.topic, venue: payload.venue.name, venueId: payload.venue.id,
    audience: payload.audience.name, audienceId: payload.audience.id,
    text: els.result.value, createdAt: new Date().toISOString(),
  });
  state.drafts = state.drafts.slice(0, 20);
  save(STORAGE.drafts, state.drafts);
  els.saveState.textContent = "Сохранён";
  renderDrafts();
}

async function copyPost() {
  await navigator.clipboard.writeText(els.result.value);
  const button = $("#copyPost");
  const original = button.textContent;
  button.textContent = "Скопировано";
  setTimeout(() => { button.textContent = original; }, 1600);
}

function openDraft(index) {
  const draft = state.drafts[index];
  if (!draft) return;
  if (draft.venueId && state.venues.some(item => item.id === draft.venueId)) {
    els.venue.value = draft.venueId;
    renderAudienceSelect(draft.audienceId);
    renderContext();
  }
  els.topic.value = draft.topic;
  els.result.value = draft.text;
  els.demo.classList.add("hidden");
  updateResultCount();
  els.saveState.textContent = "Сохранён";
  setView("editor");
  switchView("editor");
}

function startNewPost() {
  els.topic.value = "";
  els.materials.value = "";
  els.materialsCount.textContent = "0";
  els.result.value = "";
  els.error.classList.add("hidden");
  els.saveState.textContent = "Не сохранён";
  removeImage();
  setView("empty");
  switchView("editor");
  els.topic.focus();
}

function renderProfiles() {
  $("#venueCount").textContent = state.venues.length;
  $("#audienceCount").textContent = state.audiences.length;
  els.venueTree.innerHTML = state.venues.map(venue => {
    const audiences = audiencesForVenue(venue.id);
    const audienceMarkup = audiences.length
      ? audiences.map(audience => `
          <div class="audience-node">
            <div><strong>${escapeHtml(audience.name)}</strong><small>${escapeHtml(audience.description || audience.needs || "Портрет не заполнен")}</small></div>
            <div class="row-actions"><button class="button button--ghost button--xs" type="button" data-edit-audience="${audience.id}">Изменить</button><button class="button button--danger button--xs" type="button" data-remove-audience="${audience.id}" aria-label="Удалить аудиторию">Удалить</button></div>
          </div>`).join("")
      : '<p class="audience-empty">Аудитории ещё не добавлены</p>';
    return `
      <article class="venue-node">
        <div class="venue-node-header">
          <div><strong>${escapeHtml(venue.name)}</strong><small>${escapeHtml(venueSummary(venue))}</small></div>
          <div class="row-actions"><button class="button button--ghost button--xs" type="button" data-edit-venue="${venue.id}">Изменить</button><button class="button button--danger button--xs" type="button" data-remove-venue="${venue.id}" aria-label="Удалить заведение">Удалить</button></div>
        </div>
        <div class="venue-audiences">
          <div class="venue-audiences-title"><span>Аудитории этого заведения</span><b>${audiences.length}</b></div>
          ${audienceMarkup}
          <button class="button button--ghost button--xs add-linked-audience" type="button" data-add-audience="${venue.id}">＋ Добавить аудиторию</button>
        </div>
      </article>`;
  }).join("") || '<p class="profile-empty">Заведений пока нет. Добавьте первое — аудитории появятся внутри его карточки.</p>';
}

function venueSummary(item) {
  return item.researchedAt
    ? item.positioning || item.description || item.format
    : item.format || "Формат заведения не заполнен";
}

function saveVenue() {
  const name = els.profileName.value.trim();
  const format = els.profileFormat.value.trim();
  const currentGuests = els.profileCurrentGuests.value.trim();
  const desiredGuests = els.profileDesiredGuests.value.trim();
  if (!name || !format || !currentGuests || !desiredGuests) return;
  const existing = state.venues.find(item => item.id === state.editingVenueId);
  const item = existing || { id: crypto.randomUUID(), voice: "Конкретный и естественный голос, соответствующий формату заведения и его гостям.", recommendedStyles: DEFAULT_POST_STYLES };
  Object.assign(item, { name, format, currentGuests, desiredGuests });
  if (!item.researchedAt) Object.assign(item, { description: format, positioning: format });
  state.profileVenueId = item.id;
  if (!existing) state.venues.push(item);
  save(STORAGE.venues, state.venues);
  els.profileName.value = els.profileFormat.value = els.profileCurrentGuests.value = els.profileDesiredGuests.value = "";
  renderProfiles();
  renderSelects();
  els.venueDialog.close();
}

function saveAudience() {
  const venueId = state.profileVenueId;
  const name = els.audienceName.value.trim();
  const description = els.audiencePortrait.value.trim();
  const needs = els.audienceNeeds.value.trim();
  if (!venueId || !name || !description || !needs) return;
  const existing = state.audiences.find(item => item.id === state.editingAudienceId);
  if (existing) Object.assign(existing, { name, description, needs });
  else state.audiences.push({ id: crypto.randomUUID(), venueId, name, description, needs });
  save(STORAGE.audiences, state.audiences);
  renderProfiles();
  renderSelects();
  els.audienceDialog.close();
}

function openVenueDialog(venue = null) {
  state.editingVenueId = venue?.id || "";
  $("#venueDialogTitle").textContent = venue ? "Изменить заведение" : "Добавить заведение";
  els.profileName.value = venue?.name || "";
  els.profileFormat.value = venue?.format || "";
  els.profileCurrentGuests.value = venue?.currentGuests || "";
  els.profileDesiredGuests.value = venue?.desiredGuests || "";
  els.venueDialog.showModal();
}

function openAudienceDialog(venue, audience = null) {
  state.profileVenueId = venue.id;
  state.editingAudienceId = audience?.id || "";
  $("#audienceDialogTitle").textContent = audience ? "Изменить аудиторию" : "Добавить аудиторию";
  $("#audienceDialogContext").textContent = `Заведение: ${venue.name}`;
  els.audienceName.value = audience?.name || "";
  els.audiencePortrait.value = audience?.description || "";
  els.audienceNeeds.value = audience?.needs || "";
  els.audienceDialog.showModal();
}

async function checkHealth() {
  try {
    const data = await api.health();
    els.aiStatus.classList.add("ready");
    els.aiStatus.innerHTML = `<span class="status-dot"></span>${data.aiConfigured ? "AI подключён" : "Демо-режим"}`;
  } catch { els.aiStatus.innerHTML = '<span class="status-dot"></span>Сервер недоступен'; }
}

els.form.addEventListener("submit", generate);
els.venue.addEventListener("change", () => {
  renderAudienceSelect();
  renderContext();
});
els.audience.addEventListener("change", renderContext);
els.materials.addEventListener("input", () => { els.materialsCount.textContent = els.materials.value.length.toLocaleString("ru-RU"); });
els.result.addEventListener("input", updateResultCount);
$("#saveDraft").addEventListener("click", saveDraft);
$("#copyPost").addEventListener("click", copyPost);
$("#removeImage").addEventListener("click", removeImage);
els.imageInput.addEventListener("change", () => {
  const file = els.imageInput.files[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) {
    els.error.textContent = "Изображение должно быть не больше 10 МБ.";
    els.error.classList.remove("hidden");
    els.imageInput.value = "";
    return;
  }
  els.error.classList.add("hidden");
  removeImage();
  state.imageUrl = URL.createObjectURL(file);
  state.imageName = file.name;
  els.imageThumb.src = state.imageUrl;
  els.imageName.textContent = file.name;
  els.imageChip.classList.remove("hidden");
  syncResultImage();
});
els.drafts.addEventListener("click", event => {
  const button = event.target.closest("[data-draft]");
  if (button) openDraft(Number(button.dataset.draft));
});
els.draftSearch.addEventListener("input", () => renderDrafts(els.draftSearch.value));
document.querySelectorAll("[data-view]").forEach(button => {
  button.addEventListener("click", () => switchView(button.dataset.view));
});
els.sidebarToggle.addEventListener("click", () => {
  setSidebarCollapsed(!document.body.classList.contains("sidebar-collapsed"));
});
$("#openVenueDialog").addEventListener("click", () => openVenueDialog());
$("#saveVenue").addEventListener("click", saveVenue);
$("#saveAudience").addEventListener("click", saveAudience);
els.venueTree.addEventListener("click", event => {
  const editVenueButton = event.target.closest("[data-edit-venue]");
  if (editVenueButton) {
    openVenueDialog(state.venues.find(item => item.id === editVenueButton.dataset.editVenue));
    return;
  }
  const editAudienceButton = event.target.closest("[data-edit-audience]");
  if (editAudienceButton) {
    const audience = state.audiences.find(item => item.id === editAudienceButton.dataset.editAudience);
    const venue = state.venues.find(item => item.id === audience?.venueId);
    if (venue && audience) openAudienceDialog(venue, audience);
    return;
  }
  const addButton = event.target.closest("[data-add-audience]");
  if (addButton) {
    const venue = state.venues.find(item => item.id === addButton.dataset.addAudience);
    if (venue) openAudienceDialog(venue);
    return;
  }
  const venueButton = event.target.closest("[data-remove-venue]");
  if (venueButton) {
    const venue = state.venues.find(item => item.id === venueButton.dataset.removeVenue);
    const linkedCount = audiencesForVenue(venueButton.dataset.removeVenue).length;
    const message = linkedCount
      ? `Удалить «${venue?.name}» и связанные аудитории (${linkedCount})?`
      : `Удалить «${venue?.name}»?`;
    if (!window.confirm(message)) return;
    state.venues = state.venues.filter(item => item.id !== venueButton.dataset.removeVenue);
    state.audiences = state.audiences.filter(item => item.venueId !== venueButton.dataset.removeVenue);
    save(STORAGE.venues, state.venues);
    save(STORAGE.audiences, state.audiences);
    renderProfiles(); renderSelects();
    return;
  }
  const audienceButton = event.target.closest("[data-remove-audience]");
  if (audienceButton) {
    state.audiences = state.audiences.filter(item => item.id !== audienceButton.dataset.removeAudience);
    save(STORAGE.audiences, state.audiences);
    renderProfiles(); renderSelects();
  }
});

renderSelects();
renderDrafts();
renderProfiles();
setSidebarCollapsed(localStorage.getItem(STORAGE.sidebarCollapsed) === "true");
switchView("profiles");
checkHealth();
