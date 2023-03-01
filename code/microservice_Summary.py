# Allison Goldstein
# SOFTWARE ENGINEERING I (CS_361_400_S2022)
# Microservice to extract the summary from Wikipedia pages

import wikipedia
import time

while True:

    with open('stateName.txt', 'r') as fr:
        state = fr.read()

    if state:
        state += '_(U.S._state)'
        text = wikipedia.summary(state)
        with open('public/stateData.txt', 'w', encoding='utf-8') as f:
            f.write(text)

        with open('stateName.txt', 'w') as fr:
            fr.write('')

        time.sleep(1)


