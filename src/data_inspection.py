"""Module d'inspection et de compréhension des données pour la maintenance prédictive."""

from pathlib import Path
from typing import Dict, Tuple
import pandas as pd


def load_dataset(filepath: str | Path) -> pd.DataFrame:
    """Charge le fichier de données CSV sans altération."""
    path = Path(filepath)
    if not path.exists():
        raise FileNotFoundError(f"Le fichier de données est introuvable : {path}")
    return pd.read_csv(path)


def get_dataset_overview(df: pd.DataFrame) -> Dict[str, any]:
    """Retourne une vue d'ensemble : dimensions, doublons, valeurs manquantes."""
    return {
        "n_rows": int(df.shape[0]),
        "n_cols": int(df.shape[1]),
        "n_duplicates": int(df.duplicated().sum()),
        "total_missing": int(df.isnull().sum().sum()),
        "has_missing": bool(df.isnull().sum().sum() > 0),
    }


def get_variables_summary(df: pd.DataFrame) -> pd.DataFrame:
    """Génère un tableau détaillé des colonnes : types, valeurs manquantes, cardinalité et aperçu."""
    summary_data = []
    for col in df.columns:
        n_missing = int(df[col].isnull().sum())
        pct_missing = round(n_missing / len(df) * 100, 3)
        n_unique = int(df[col].nunique())
        dtype = str(df[col].dtype)
        sample_vals = str(list(df[col].dropna().head(3).values))

        summary_data.append(
            {
                "Colonne": col,
                "Type": dtype,
                "Manquants": n_missing,
                "% Manquants": pct_missing,
                "Valeurs Uniques": n_unique,
                "Exemples": sample_vals,
            }
        )

    return pd.DataFrame(summary_data)


def get_descriptive_stats(df: pd.DataFrame) -> pd.DataFrame:
    """Calcule les statistiques descriptives complètes des variables numériques."""
    numeric_df = df.select_dtypes(include="number")
    desc = numeric_df.describe().T
    desc["median"] = numeric_df.median()
    desc["skew"] = numeric_df.skew()
    desc["kurtosis"] = numeric_df.kurtosis()
    return desc[
        ["count", "mean", "std", "min", "25%", "median", "75%", "max", "skew", "kurtosis"]
    ].round(4)
