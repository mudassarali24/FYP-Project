import tkinter as tk
from tkinter import filedialog, messagebox, Tk, Label, Button, Entry
import requests
import shutil

# API Endpoint
URL = "http://localhost:5001/api/items/add"

class ItemUploader:
    def __init__(self, master):
        self.master = master
        master.title("Item Uploader")

        Label(master, text="Title:").grid(row=0)
        Label(master, text="Price:").grid(row=1)
        Label(master, text="Stock:").grid(row=2)

        self.title_entry = Entry(master)
        self.price_entry = Entry(master)
        self.stock_entry = Entry(master)
        self.image_entry = Entry(master, width=40)

        self.title_entry.grid(row=0, column=1)
        self.price_entry.grid(row=1, column=1)
        self.stock_entry.grid(row=2, column=1)
        self.image_entry.grid(row=3, column=1)

        Button(master, text="Browse Image", command=self.select_image).grid(row=3, column=2)
        Button(master, text="Submit", command=self.submit_item).grid(row=4, column=1)

        self.image_path = None

    def select_image(self):
        # Use filedialog to select the image path
        self.image_path = filedialog.askopenfilename()
        if self.image_path:
            # Display the path in the image entry
            self.image_entry.delete(0, tk.END)
            self.image_entry.insert(0, self.image_path)

    def submit_item(self):
        title = self.title_entry.get()
        price = self.price_entry.get()
        stock = self.stock_entry.get()
        image_path = self.image_entry.get()

        if not title or not price or not stock or not image_path:
            messagebox.showerror("Error", "All fields are required!")
            return

        try:
            price = float(price)
            stock = int(stock)
        except ValueError:
            messagebox.showerror("Error", "Price must be a number, and stock must be an integer!")
            return

        # Extract the filename and prepare the file for upload
        try:
            with open(image_path, 'rb') as image_file:
                files = {'image': image_file}
                data = {
                    "title": title,
                    "price": price,
                    "stock": stock,
                }

                # Send the request as form-data
                response = requests.post(
                    'http://localhost:5001/api/items/add',
                    data=data,
                    files=files
                )

                print("Response Status Code:", response.status_code)  # Print the status code
                print("Response Text:", response.text)  # Print the raw response body

                if response.status_code == 201:
                    messagebox.showinfo("Success", "Item added successfully!")
                    self.clear_fields()
                else:
                    messagebox.showerror("Error", f"Error adding item: {response.text}")

        except FileNotFoundError:
            messagebox.showerror("Error", f"Image file not found: {image_path}")
        except Exception as e:
            messagebox.showerror("Error", f"An unexpected error occurred: {e}")


    def clear_fields(self):
        self.title_entry.delete(0, tk.END)
        self.price_entry.delete(0, tk.END)
        self.stock_entry.delete(0, tk.END)
        self.image_entry.delete(0, tk.END)

root = Tk()
app = ItemUploader(root)
root.mainloop()
