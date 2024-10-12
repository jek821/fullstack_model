# Fullstack Model

This project uses **AWS SageMaker** and **AWS Lambda** to handle image input from a locally hosted webpage, process the image using a trained machine learning classification model, and return the model’s classification result to be displayed on the webpage.

The main focus of this project is to experiment with building a full-stack web application that integrates AWS cloud services and cost-efficient RESTful APIs. By hosting machine learning models using AWS services, this project demonstrates how to efficiently connect user-friendly web interfaces with trained models, minimizing overhead and cost.

### **Model Overview**:
This project uses a simple machine learning model trained with **TensorFlow** to classify handwritten single digits (0-9). While the model itself is straightforward, the primary goal is to explore architectural patterns and interactions between the front-end and back-end using AWS.

---

### **Tech Stack Overview**:

#### **1. Frontend (HTML, CSS, JavaScript)**:
The front end consists of a basic web interface where users can interact with the model:

- **Drawing Board**: Users can draw a digit (0-9) using an interactive canvas to submit to the model for classification.
- **Submit Button**: A button that triggers the POST request to send the drawn image to the Flask API hosted on AWS Lambda.
- **Results Display**: A section where the classification result from the model will be shown after the processing is complete.

#### **2. Backend (AWS Lambda with Flask, Zappa, and Boto3)**:
The backend is deployed on **AWS Lambda** using **Flask** to handle the image preprocessing and interaction with the model hosted on SageMaker.

- **Flask**: Serves as the RESTful API interface. It receives image uploads from the frontend, preprocesses them, and returns the classification result.
- **PIL (Python Imaging Library)**, **Keras**, and **NumPy**: These libraries preprocess the image input (resize, normalization, etc.) before it is sent to the SageMaker model.
- **Zappa**: Deploys the Flask app on AWS Lambda, making it serverless and scalable.
- **Boto3**: The AWS SDK for Python, used to interact with SageMaker and other AWS services. In this case, it handles communication between the Flask API and the SageMaker model endpoint.

#### **3. AWS SageMaker (TensorFlow Keras Model)**:
The machine learning model is hosted on AWS SageMaker as a RESTful endpoint.

- **SageMaker Endpoint**: The model is deployed as an endpoint that can accept image data for classification. The endpoint is created using the Boto3 library, and it is queried by the Flask API whenever a new image is submitted for inference.
- **TensorFlow**: The model is a simple neural network built using TensorFlow and Keras, trained to classify handwritten digits (similar to the MNIST dataset).

### **Project Workflow**:

1. **Frontend Interaction**:
   - Users draw a digit on the webpage's canvas and click the submit button.
   - The JavaScript app sends the image to the Flask API (deployed on AWS Lambda) using the `fetch()` protocol.

2. **Backend Processing**:
   - The Flask API, running on AWS Lambda, receives the image.
   - The image is preprocessed (resized, normalized) using PIL and NumPy to match the input format expected by the model.
   - The preprocessed image is then sent to the SageMaker endpoint via Boto3 for inference.

3. **Model Inference**:
   - The SageMaker model processes the input and returns a classification result (the predicted digit).

4. **Display the Result**:
   - The Flask API sends the classification result back to the frontend, where it is displayed on the webpage.

---

### **Future Improvements (Work in Progress)**:
- Improve the front-end design for better user interaction.
- Experiment with different models and datasets for more complex classification tasks.
- Optimize cost efficiency by using AWS Lambda and SageMaker serverless features.
- Add more detailed logging and error handling for troubleshooting.
- Establish cost efficient AWS hosting for front end user interface.

---

### **How to Run This Project Locally**:
(TBD)
