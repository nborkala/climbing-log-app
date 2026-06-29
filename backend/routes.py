import services
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class PrzejscieData(BaseModel):
    user_id: int
    droga_id: int
    styl: str
    liczba_prob: int
    ocena: Optional[int] = None
    komentarz: Optional[str] = None

class EdycjaPrzejsciaData(BaseModel):
    droga_id: int
    styl: str
    liczba_prob: int
    ocena: Optional[int] = None
    komentarz: Optional[str] = None

@router.get("/")
def root():
    return {"Aplikacja webowa -  Dziennik Przejsc wspinaczkowych"}

@router.get("/sektory")
def sektory():
    tmp = services.getSectors()
    return tmp

@router.get("/drogi")
def drogi():
    tmp = services.getRoutes()
    return tmp

@router.get("/przejscia")
def przejscia():
    tmp = services.getDone()
    return tmp

@router.delete("/usunPrzejscie/{id}")
def usuwanie(id):
    services.Delete(id)

@router.get("/logowanie")
def loging(login, haslo):
    return services.Log(login,haslo)

@router.get("/lokalizacje")
def lokal():
    return services.localization()

@router.post("/dodajPrzejscie")
def add(dane: PrzejscieData):
    wynik = services.dodaj(
        user_id=dane.user_id,
        droga_id=dane.droga_id,
        styl=dane.styl,
        liczba_prob=dane.liczba_prob,
        ocena=dane.ocena,
        komentarz=dane.komentarz
    )
    return wynik

@router.put("/edytujPrzejscie/{przejscie_id}")
def edit(przejscie_id: int, dane: EdycjaPrzejsciaData):
    wynik = services.edytuj(
        przejscie_id=przejscie_id,
        droga_id=dane.droga_id,
        styl=dane.styl,
        liczba_prob=dane.liczba_prob,
        ocena=dane.ocena,
        komentarz=dane.komentarz
    )
    return wynik

@router.get("/statystyki/{user_id}")
def get_user_stats(user_id: int):
    return services.pobierz_statystyki(user_id)