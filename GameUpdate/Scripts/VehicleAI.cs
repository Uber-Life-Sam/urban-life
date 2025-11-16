using UnityEngine;

public class VehicleAI : MonoBehaviour
{
    public Transform[] points;
    int currentPoint = 0;
    public float speed = 3f;

    public TrafficLightController signal;

    void Update()
    {
        // Stop car if signal is red
        if (signal != null && signal.redLight.activeSelf)
            return;

        transform.position = Vector3.MoveTowards(
            transform.position,
            points[currentPoint].position,
            speed * Time.deltaTime
        );

        transform.LookAt(points[currentPoint].position);

        if (Vector3.Distance(transform.position, points[currentPoint].position) < 0.3f)
        {
            currentPoint++;
            if (currentPoint >= points.Length)
                currentPoint = 0;
        }
    }
}
