# Patrycjusz Bachleda
# SOFTWARE ENGINEERING I (CS_361_400_S2022)
# Microservice to extract data from Wikipedia tables

import time
import requests
from bs4 import BeautifulSoup

def request():
    """checks if there is a request"""
    file = open('stateName1.txt', 'r')
    searchWord = file.readline()
    file.close()
    searchWord.replace(' ', '_')     # creates a valid name
    searchWord += '_(U.S._state)'
    return searchWord

def get_from_Wikipedia():
    """requests data from Wikipedia"""
    link = "https://en.wikipedia.org/wiki/" + searchWord
    result = requests.get(link)
    all_page_info = result.content          # stores the content of the page as a variable
    return BeautifulSoup(all_page_info, 'lxml')  # creates BeautifulSoup object based on the all_page_info variable to parse and process the info

def response():
    """saves extracted data into the file"""
    file = open('./public/stateFacts.txt', encoding='utf-8', mode='w')
    for i in data:
        file.write(i + '\n')
    file.close()

def table():
    """extracts data from the table"""
    count = 1
    count1 = 1
    for tr_tag in soup.find_all('tr'):
        table = tr_tag.text
        if table[3:8] == 'Total':
            # some pages have no spaces between words and numbers in the table
            table = table[0:8] + ' ' + table[8:]
            if count == 1:
                data.append("Area " + table[3:])
            if count == 2:
                data.append("Population " + table[3:])
            count += 1
        elif table[3:7] == 'Land':
            table = table[0:7] + ' ' + table[7:]
            data.append(table[3:])
        elif table[3:8] == 'Water':
            table = table[0:8] + ' ' + table[8:]
            data.append(table[3:])
        elif table[3:7] == 'Rank':
            table = table[0:7] + ' ' + table[7:]
            if count1 == 1:
                data.append("Area " + table[3:])
            if count1 == 2:
                data.append("Population " + table[3:])
            count1 += 1
        elif table[0:4] == 'Lati':
            table = table[0:8] + ' ' + table[8:]
            data.append(table)
        elif table[0:4] == 'Long':
            table = table[0:9] + ' ' + table[9:]
            data.append(table)
            break

wait = ''   # a variable used when checking if a new request received

while True:     # it runs constantly and checks if a new request received
    searchWord = request()
    time.sleep(1)
    if searchWord != wait:                      # only if a new request received
        wait = searchWord
        data = []  # to store the extracted data
        temp = searchWord.replace('_(U.S._state)', '')
        temp = temp.replace('_', ' ')
        data.append(temp + ':')
        soup = get_from_Wikipedia()
        table()
        response()
