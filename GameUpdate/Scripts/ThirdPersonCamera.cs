using UnityEngine;

public class ThirdPersonCamera : MonoBehaviour
{
    public Transform target;
    public float mouseSensitivity = 5f;
    public float distance = 4f;

    float xRotation = 0f;
    float yRotation = 0f;

    void LateUpdate()
    {
        float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity;
        float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity;

        xRotation -= mouseY;
        yRotation += mouseX;

        xRotation = Mathf.Clamp(xRotation, -20f, 60f);

        Quaternion rotation = Quaternion.Euler(xRotation, yRotation, 0);
        transform.position = target.position - rotation * Vector3.forward * distance;
        transform.LookAt(target);
    }
}
