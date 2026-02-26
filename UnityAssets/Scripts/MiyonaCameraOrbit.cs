using UnityEngine;
using UnityEngine.InputSystem;

public class MiyonaCameraOrbit : MonoBehaviour
{
    [Header("Targeting")]
    [Tooltip("The object the camera revolves around (e.g., Miyona's Head bone)")]
    public Transform target;
    
    [Header("Movement Speeds")]
    public float rotationSpeed = 20.0f; // Lowered slightly for new Input System
    public float zoomSpeed = 0.05f;     // Lowered because Scroll.y can be large
    
    [Header("Zoom Limits")]
    public float minDistance = 1.0f;
    public float maxDistance = 5.0f;
    
    [Header("Vertical Rotation Limits")]
    public float minYAngle = -10f; // How low you can look
    public float maxYAngle = 45f;  // How high you can look

    private float currentDistance = 2.5f; // Starting distance
    private float currentX = 0.0f;
    private float currentY = 0.0f;
    
    // Smoothness parameters
    private float xSmooth = 0.0f;
    private float ySmooth = 0.0f;
    private float distanceSmooth = 2.5f;

    void Start()
    {
        // Get the starting rotation if available
        Vector3 angles = transform.eulerAngles;
        currentX = angles.y;
        currentY = angles.x;

        // Make sure distance starts where the camera currently is
        if (target != null)
        {
            currentDistance = Vector3.Distance(transform.position, target.position);
            distanceSmooth = currentDistance;
        }
    }

    void LateUpdate()
    {
        if (target == null) return;
        if (Mouse.current == null) return; // Safety check

        // 1. Check for Mouse Drag (Left click pressed down)
        if (Mouse.current.leftButton.isPressed || Mouse.current.rightButton.isPressed)
        {
            Vector2 delta = Mouse.current.delta.ReadValue();
            currentX += delta.x * rotationSpeed * Time.deltaTime;
            currentY -= delta.y * rotationSpeed * Time.deltaTime; // Minus to invert Y
        }
        
        // Clamp the vertical rotation so we don't flip upside down
        currentY = Mathf.Clamp(currentY, minYAngle, maxYAngle);

        // 2. Check for Scroll Wheel (Zoom)
        float scrollInput = Mouse.current.scroll.ReadValue().y;
        if (Mathf.Abs(scrollInput) > 0.01f)
        {
            currentDistance -= scrollInput * zoomSpeed;
            currentDistance = Mathf.Clamp(currentDistance, minDistance, maxDistance);
        }

        // 3. Smoothly move variables
        xSmooth = Mathf.Lerp(xSmooth, currentX, Time.deltaTime * 10f);
        ySmooth = Mathf.Lerp(ySmooth, currentY, Time.deltaTime * 10f);
        distanceSmooth = Mathf.Lerp(distanceSmooth, currentDistance, Time.deltaTime * 5f);

        // 4. Calculate the new position and rotation around the target
        Quaternion rotation = Quaternion.Euler(ySmooth, xSmooth, 0);
        Vector3 position = target.position - (rotation * Vector3.forward * distanceSmooth);

        // Apply them to the camera
        transform.position = position;
        transform.rotation = rotation;
    }
}
