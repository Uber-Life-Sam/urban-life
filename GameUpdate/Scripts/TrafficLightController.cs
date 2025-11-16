using UnityEngine;

public class TrafficLightController : MonoBehaviour
{
    public GameObject redLight;
    public GameObject yellowLight;
    public GameObject greenLight;

    public float greenTime = 5f;
    public float yellowTime = 2f;
    public float redTime = 5f;

    float timer = 0f;
    int state = 0;

    void Update()
    {
        timer += Time.deltaTime;

        switch (state)
        {
            case 0:
                greenLight.SetActive(true);
                yellowLight.SetActive(false);
                redLight.SetActive(false);

                if (timer >= greenTime)
                {
                    state = 1;
                    timer = 0;
                }
                break;

            case 1:
                greenLight.SetActive(false);
                yellowLight.SetActive(true);
                redLight.SetActive(false);

                if (timer >= yellowTime)
                {
                    state = 2;
                    timer = 0;
                }
                break;

            case 2:
                greenLight.SetActive(false);
                yellowLight.SetActive(false);
                redLight.SetActive(true);

                if (timer >= redTime)
                {
                    state = 0;
                    timer = 0;
                }
                break;
        }
    }
}
