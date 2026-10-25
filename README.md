# EVIoT-Electric-Vehicle-IoT-Predictive-Maintenance
« Analyse et prédiction de la maintenance préventive des véhicules électriques par les techniques de Data Mining »

**Auteurs / Équipe :** Mohamed, Fateh & équipe projet EVIoT (5 membres)  
**Dépôt officiel :** [https://github.com/fateh1818/EVIoT-Electric-Vehicle-IoT-Predictive-Maintenance](https://github.com/fateh1818/EVIoT-Electric-Vehicle-IoT-Predictive-Maintenance)

---

## 📌 Présentation du Projet
Ce projet académique de **Data Mining & Machine Learning** a pour objectif d'anticiper les défaillances techniques et d'optimiser la maintenance prédictive d'une flotte de véhicules électriques connectés (**EVIoT**).

En exploitant les données télématiques et les signaux de capteurs IoT (batterie, moteur, freinage, suspension, environnement), nous concevons un système d'aide à la décision capable d'alerter les gestionnaires de flotte et conducteurs avant la survenue d'une panne critique.

---

## 👥 Équipe de Projet (5 personnes)
- **Membre 1** : Gestion de projet, structuration et déploiement Streamlit
- **Membre 2** : Ingestion, compréhension et nettoyage des données (Phases 1 & 2)
- **Membre 3** : Analyse exploratoire des données (EDA) & visualisations (Phase 3)
- **Membre 4** : Ingénierie des caractéristiques & pipelines Scikit-Learn (Phase 4)
- **Membre 5** : Modélisation, optimisation des hyperparamètres & interprétabilité SHAP (Phases 5, 6 & 7)

---

## 📂 Architecture du Projet
```text
projet/
├── data/                  # Données brutes (ignorées par git pour les volumétries > 50 Mo)
│   └── EV_Predictive_Maintenance_Dataset_15min.csv
├── notebooks/             # Notebooks d'exploration et d'expérimentation reproductibles
├── src/                   # Modules Python réutilisables (nettoyage, features, modélisation)
├── models/                # Artefacts des modèles sérialisés (.joblib)
├── app.py                 # Application web interactive (Streamlit)
├── requirements.txt       # Dépendances Python du projet
├── README.md              # Documentation complète du projet
└── .gitignore             # Exclusion des fichiers temporaires et données volumineuses
```

---

## 🛠️ Installation et Environnement

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/fateh1818/EVIoT-Electric-Vehicle-IoT-Predictive-Maintenance.git
   cd EVIoT-Electric-Vehicle-IoT-Predictive-Maintenance
   ```

2. **Créer et activer un environnement virtuel :**
   ```bash
   # Sous Windows
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. **Installer les dépendances :**
   ```bash
   pip install -r requirements.txt
   ```

---

## 🚀 Feuille de Route Méthodologique
- [x] **Phase 0** : Mise en place de la structure, des dépendances et du versioning Git.
- [ ] **Phase 1** : Compréhension des données, dictionnaire des variables et sélection de la cible.
- [ ] **Phase 2** : Nettoyage rigoureux des données (valeurs manquantes, doublons, cohérence physique).
- [ ] **Phase 3** : Analyse exploratoire approfondie (EDA) et contrôle des fuites d'information.
- [ ] **Phase 4** : Préparation, feature engineering et Pipeline de transformation.
- [ ] **Phase 5** : Modélisation supervisée (Baseline, Random Forest, XGBoost/LightGBM).
- [ ] **Phase 6** : Évaluation orientée métier (priorisation du Rappel, PR-AUC, matrice de coût).
- [ ] **Phase 7** : Explicabilité globale et locale (SHAP values & importance des features).
- [ ] **Phase 8** : Sérialisation et packaging du Pipeline de prédiction complet.
- [ ] **Phase 9** : Déploiement de l'interface utilisateur interactive (Streamlit).
- [ ] **Phase 10** : Rapport final, synthèse académique et revue de soutenance.
