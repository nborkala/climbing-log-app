import database


def getDone():
    lista = database.pobieranie_przejsc()
    return lista

def getSectors():
    lista = database.pobieranie_sektorow()
    return lista

def getRoutes():
    lista = database.pobieranie_drog()
    return lista

def Delete(id):
    database.usuwanie_przejscia(id)

def Log(log, passw):
    return database.logowanie(log, passw)

def localization():
    return database.local()

def dodaj(user_id, droga_id, styl, liczba_prob, ocena, komentarz):
    return database.dodaj_przejscie(user_id, droga_id, styl, liczba_prob, ocena, komentarz)

def edytuj(przejscie_id, droga_id, styl, liczba_prob, ocena, komentarz):
    return database.edytuj_przejscie(przejscie_id, droga_id, styl, liczba_prob, ocena, komentarz)

def pobierz_statystyki(user_id):
    return database.pobierz_statystyki_uzytkownika(user_id)