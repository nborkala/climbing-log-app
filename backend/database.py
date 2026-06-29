from mysql import connector
import os
from dotenv import load_dotenv

load_dotenv()

def polaczenie():
    return connector.connect(
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    database=os.getenv("DB_NAME"))


def pobieranie_przejsc():
    connection = polaczenie()
    cursor = connection.cursor(dictionary=True)
    zapytanie = "SELECT * FROM `przejscia`;"
    cursor.execute(zapytanie)
    lista = cursor.fetchall()
    connection.close()
    return lista


def pobieranie_sektorow():
    connection = polaczenie()
    cursor = connection.cursor(dictionary=True)
    zapytanie = "SELECT * FROM `sektory`;"
    cursor.execute(zapytanie)
    lista = cursor.fetchall()
    connection.close()
    return lista


def pobieranie_drog():
    connection = polaczenie()
    cursor = connection.cursor(dictionary=True)
    zapytanie = "SELECT * FROM `drogi`;"
    cursor.execute(zapytanie)
    lista = cursor.fetchall()
    connection.close()
    return lista

def usuwanie_przejscia(id):
    connection = polaczenie()
    cursor = connection.cursor(dictionary=True)
    zapytanie = "DELETE FROM przejscia WHERE id = %s;"
    cursor.execute(zapytanie, (id,))
    connection.commit()
    connection.close()

def logowanie(login, haslo):
    connection = polaczenie()
    cursor = connection.cursor(dictionary=True)
    zapytanie = "SELECT * FROM uzytkownicy WHERE login = %s AND haslo = %s"
    cursor.execute(zapytanie, (login, haslo))
    
    wynik = cursor.fetchone()
    
    cursor.close()
    connection.close()
    
    if isinstance(wynik, dict):
        return {"zalogowano": True, "user_id": wynik['id']}
        
    return {"zalogowano": False, "user_id": None}

def local():
    connection = polaczenie()
    cursor = connection.cursor(dictionary=True)
    zapytanie = "SELECT * FROM `lokalizacje`;"
    cursor.execute(zapytanie)
    lista = cursor.fetchall()
    connection.close()
    return lista

def dodaj_przejscie(user_id, droga_id, styl, liczba_prob, ocena, komentarz):
    connection = polaczenie()
    cursor = connection.cursor(dictionary=True)
    zapytanie = "INSERT INTO przejscia (user_id, droga_id, styl, liczba_prob, data_przejscia, ocena, komentarz) VALUES (%s, %s, %s, %s, CURDATE(), %s, %s);"
    cursor.execute(zapytanie, (user_id, droga_id, styl, liczba_prob, ocena, komentarz))
    connection.commit() 
    cursor.close()
    connection.close()
    return {"zapisano": True}

def edytuj_przejscie(przejscie_id, droga_id, styl, liczba_prob, ocena, komentarz):
    connection = polaczenie()
    cursor = connection.cursor()
    zapytanie = "UPDATE przejscia SET droga_id = %s, styl = %s, liczba_prob = %s, ocena = %s, komentarz = %sWHERE id = %s;"
    cursor.execute(zapytanie, (droga_id, styl, liczba_prob, ocena, komentarz, przejscie_id))
    connection.commit() 
    cursor.close()
    connection.close()
    return {"zaktualizowano": True}

def pobierz_statystyki_uzytkownika(user_id):
    connection = polaczenie()
    cursor = connection.cursor(dictionary=True)
    q_lokalizacje = """
        SELECT l.nazwa, COUNT(d.id) AS ilosc 
        FROM lokalizacje l 
        LEFT JOIN sektory s ON s.lokalizacja_id = l.id 
        LEFT JOIN drogi d ON d.sektor_id = s.id 
        GROUP BY l.id, l.nazwa;
    """
    cursor.execute(q_lokalizacje)
    drog_lokalizacje = cursor.fetchall()
    q_sektory = """
        SELECT s.nazwa, COUNT(d.id) AS ilosc 
        FROM sektory s 
        LEFT JOIN drogi d ON d.sektor_id = s.id 
        GROUP BY s.id, s.nazwa;
    """
    cursor.execute(q_sektory)
    drog_sektory = cursor.fetchall()
    q_os = """
        SELECT COUNT(id) AS ogolem,
               SUM(CASE WHEN styl = 'OS' THEN 1 ELSE 0 END) AS os_ogolem
        FROM przejscia
        WHERE user_id = %s;
    """
    cursor.execute(q_os, (user_id,))
    staty_os = cursor.fetchone() 
    q_popularnosc = """
        SELECT d.nazwa, COUNT(p.id) AS liczba_przejsc 
        FROM drogi d 
        JOIN przejscia p ON p.droga_id = d.id 
        GROUP BY d.id, d.nazwa 
        ORDER BY liczba_przejsc DESC;
    """
    cursor.execute(q_popularnosc)
    popularnosc_drog = cursor.fetchall()
    q_wykres = """
        SELECT data_przejscia, COUNT(id) AS ilosc
        FROM przejscia
        WHERE user_id = %s
        GROUP BY data_przejscia
        ORDER BY data_przejscia ASC;
    """
    cursor.execute(q_wykres, (user_id,))
    daty_przejsc = cursor.fetchall()
    q_metry = """
        SELECT SUM(d.dlugosc * p.liczba_prob) AS lacznie_metrow
        FROM przejscia p
        JOIN drogi d ON p.droga_id = d.id
        WHERE p.user_id = %s;
    """
    cursor.execute(q_metry, (user_id,))
    staty_metry = cursor.fetchone()
    cursor.close()
    connection.close()
    lacznie_metrow = 0
    if staty_metry and "lacznie_metrow" in staty_metry and staty_metry["lacznie_metrow"] is not None:
        lacznie_metrow = staty_metry["lacznie_metrow"]
    
    return {
        "drog_lokalizacje": drog_lokalizacje,
        "drog_sektory": drog_sektory,
        "staty_os": staty_os,
        "popularnosc_drog": popularnosc_drog,
        "daty_przejsc": daty_przejsc,
        "lacznie_metrow": lacznie_metrow
    }